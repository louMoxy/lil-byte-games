'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 12

function isLinkUnderPoint(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY)
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    if (node instanceof HTMLAnchorElement) {
      const href = node.getAttribute('href')
      if (href != null && href !== '' && !href.toLowerCase().startsWith('javascript:')) {
        return true
      }
    }
    if (node instanceof SVGAElement) {
      const href = node.getAttribute('href') || node.getAttribute('xlink:href')
      if (href) return true
    }
    if (node.getAttribute('role') === 'link') return true
    node = node.parentElement
  }
  return false
}

/** Smooth follow + rAF DOM updates (no per-frame React state). */
export function CyberCursor() {
  const visibleRef = useRef(false)
  const snappedRef = useRef(false)
  const target = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)
  const orbitPhase = useRef(0)
  const holdPulsePhase = useRef(0)
  const linkHoverRef = useRef(false)
  const linkBlendRef = useRef(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const dotGroupRef = useRef<HTMLDivElement>(null)
  const dotDefaultRef = useRef<HTMLDivElement>(null)
  const dotLinkRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const triangleRef = useRef<HTMLDivElement>(null)
  const particleRefs = useRef<(HTMLDivElement | null)[]>([])
  const pressedRef = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')
    if (reduced.matches || coarse.matches) return

    document.body.classList.add('cursor-none', 'cyber-cursor-active')

    const setVisible = (v: boolean) => {
      if (visibleRef.current === v) return
      visibleRef.current = v
      const el = wrapRef.current
      if (el) el.style.opacity = v ? '1' : '0'
      if (!v) linkHoverRef.current = false
    }

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      linkHoverRef.current = isLinkUnderPoint(e.clientX, e.clientY)
      if (!snappedRef.current) {
        snappedRef.current = true
        dot.current = { ...target.current }
        ring.current = { ...target.current }
      }
      setVisible(true)
    }

    const onDown = () => {
      pressedRef.current = true
    }
    const onUp = () => {
      pressedRef.current = false
    }

    const onLeave = () => {
      setVisible(false)
      linkHoverRef.current = false
    }

    let lastT = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05)
      lastT = now

      const tx = target.current.x
      const ty = target.current.y
      dot.current.x += (tx - dot.current.x) * 0.35
      dot.current.y += (ty - dot.current.y) * 0.35
      ring.current.x += (tx - ring.current.x) * 0.12
      ring.current.y += (ty - ring.current.y) * 0.12

      const dx = dot.current.x
      const dy = dot.current.y
      const rx = ring.current.x
      const ry = ring.current.y
      const press = pressedRef.current

      const linkTarget = linkHoverRef.current ? 1 : 0
      linkBlendRef.current += (linkTarget - linkBlendRef.current) * 0.2
      const lb = linkBlendRef.current

      if (press) {
        holdPulsePhase.current += dt * 14
      } else {
        holdPulsePhase.current *= 0.85
      }

      const pulse =
        press || holdPulsePhase.current > 0.01
          ? 0.1 * Math.sin(holdPulsePhase.current) + 0.06 * Math.sin(holdPulsePhase.current * 2.4)
          : 0

      const ringScale = (press ? 0.82 : 1) * (1 + pulse)
      const dotScale = press ? 1.35 : 1

      orbitPhase.current += dt * 1.1
      const t = now * 0.001
      const baseR = 36 + lb * 5

      if (dotGroupRef.current) {
        dotGroupRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%) scale(${dotScale})`
      }
      if (dotDefaultRef.current) {
        dotDefaultRef.current.style.opacity = String((1 - lb) * (visibleRef.current ? 1 : 0))
      }
      if (dotLinkRef.current) {
        dotLinkRef.current.style.opacity = String(lb * (visibleRef.current ? 1 : 0))
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`
        ringRef.current.style.opacity = String((1 - lb) * (visibleRef.current ? 1 : 0))
      }
      if (triangleRef.current) {
        triangleRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`
        triangleRef.current.style.opacity = String(lb * (visibleRef.current ? 1 : 0))
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const el = particleRefs.current[i]
        if (!el) continue
        const spread = (Math.PI * 2 * i) / PARTICLE_COUNT
        const a = orbitPhase.current + spread + Math.sin(t * 0.8 + i * 0.4) * 0.2
        const wobble = Math.sin(t * 2.2 + i * 0.9) * 5
        const r = baseR + wobble + (press ? Math.sin(holdPulsePhase.current + i) * 3 : 0)
        const px = rx + Math.cos(a) * r
        const py = ry + Math.sin(a) * r
        const pScale = 0.75 + Math.sin(t * 3 + i) * 0.2 + (press ? 0.15 : 0) + lb * 0.12
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${pScale})`
        el.style.opacity = visibleRef.current
          ? String((0.55 + Math.sin(t * 2 + i) * 0.25) * (0.75 + lb * 0.25))
          : '0'
      }

      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('blur', onUp)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('cursor-none', 'cyber-cursor-active')
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('blur', onUp)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-0 transition-opacity duration-300"
      aria-hidden
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            particleRefs.current[i] = el
          }}
          className={
            i % 3 === 0
              ? 'absolute top-0 left-0 h-1 w-1 rounded-full bg-fuchsia-400 shadow-[0_0_6px_1px_rgba(217,70,239,0.9)] will-change-transform'
              : i % 3 === 1
                ? 'absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_8px_1px_rgba(34,211,238,0.85)] will-change-transform'
                : 'bg-primary-300 absolute top-0 left-0 h-0.5 w-0.5 rounded-full shadow-[0_0_5px_1px_rgba(57,149,198,0.9)] will-change-transform'
          }
          style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)', opacity: 0 }}
        />
      ))}
      {/* Default: glassy circle */}
      <div
        ref={ringRef}
        className="cyber-cursor-ring to-primary-500/25 absolute top-0 left-0 h-14 w-14 rounded-full border border-cyan-400/50 bg-gradient-to-br from-fuchsia-500/20 via-cyan-400/15 shadow-[0_0_28px_rgba(34,211,238,0.5),0_0_56px_rgba(217,70,239,0.25),inset_0_0_18px_rgba(255,255,255,0.2)] backdrop-blur-[2px] will-change-transform dark:border-cyan-300/60"
        style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)', opacity: 0 }}
      />
      {/* Link: upward triangle, magenta-forward palette */}
      <div
        ref={triangleRef}
        className="cyber-cursor-triangle absolute top-0 left-0 h-[18px] w-[22px] will-change-transform"
        style={{
          transform: 'translate3d(0,0,0) translate(-50%, -50%)',
          opacity: 0,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          background:
            'linear-gradient(165deg, rgba(217,70,239,0.95) 0%, rgba(34,211,238,0.75) 55%, rgba(57,149,198,0.85) 100%)',
          boxShadow: 'inset 0 0 12px rgba(255,255,255,0.25)',
        }}
      />
      {/* Inner core — crossfade default cyan vs link fuchsia */}
      <div
        ref={dotGroupRef}
        className="absolute top-0 left-0 h-2 w-2 will-change-transform"
        style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)' }}
      >
        <div
          ref={dotDefaultRef}
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_2px_rgba(34,211,238,0.9),0_0_24px_rgba(217,70,239,0.5)] dark:bg-cyan-200"
          style={{ opacity: 1 }}
        />
        <div
          ref={dotLinkRef}
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_14px_3px_rgba(217,70,239,0.95),0_0_22px_rgba(34,211,238,0.55)]"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  )
}
