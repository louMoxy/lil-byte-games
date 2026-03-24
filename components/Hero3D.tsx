'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type HeroVariant = 'inline' | 'background'

export function Hero3D({
  className,
  variant = 'inline',
}: {
  className?: string
  variant?: HeroVariant
}) {
  const containerRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const palette = useMemo(
    () => ({
      cyan: new THREE.Color(0x3fd2f3),
      electric: new THREE.Color(0x6394cf),
      magenta: new THREE.Color(0x88bfdd),
    }),
    []
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const isBackground = variant === 'background'

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    const measure = () => {
      if (isBackground) {
        return {
          width: Math.max(1, window.innerWidth),
          height: Math.max(1, window.innerHeight),
        }
      }
      return {
        width: Math.max(1, container.clientWidth),
        height: Math.max(1, container.clientHeight),
      }
    }

    const { width, height } = measure()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(palette.electric, 10, 32)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 80)
    camera.position.set(0, 0.6, 10)

    const particleCount = isBackground ? 750 : 900
    const spread = 7
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 2
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: palette.cyan,
      size: isBackground ? 0.05 : 0.06,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    type MaterialLike = {
      transparent?: boolean
      opacity?: number
      dispose?: () => void
    }

    const wireGroup = new THREE.Group()
    scene.add(wireGroup)

    const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2)
    const cubeCount = isBackground ? 14 : 18

    for (let i = 0; i < cubeCount; i++) {
      const angle = (i / cubeCount) * Math.PI * 2
      const radius = 3.5 + Math.random() * 1.6

      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * 3.2
      const z = Math.sin(angle) * radius

      const color = i % 3 === 0 ? palette.cyan : i % 3 === 1 ? palette.magenta : palette.electric

      const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: isBackground ? 0.38 : 0.48,
      })

      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(x, y, z)
      cube.rotation.set(Math.random(), Math.random(), Math.random())
      wireGroup.add(cube)
    }

    const grid = new THREE.GridHelper(16, 26, palette.cyan, palette.electric)
    const gridMat = grid.material as MaterialLike
    gridMat.transparent = true
    gridMat.opacity = isBackground ? 0.08 : 0.12
    grid.position.y = -3.2
    scene.add(grid)

    const target = { x: 0, y: 0 }
    const mouse = { x: 0, y: 0 }

    const onPointerMove = (e: PointerEvent) => {
      if (isBackground) {
        const nx = e.clientX / window.innerWidth
        const ny = e.clientY / window.innerHeight
        target.x = (nx - 0.5) * 2
        target.y = (ny - 0.5) * 2
        return
      }
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      target.x = (nx - 0.5) * 2
      target.y = (ny - 0.5) * 2
    }

    if (!reduced) {
      if (isBackground) {
        window.addEventListener('pointermove', onPointerMove)
      } else {
        container.addEventListener('pointermove', onPointerMove)
      }
    }

    const onResize = () => {
      const nextWidth = measure().width
      const nextHeight = measure().height
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight, false)
    }

    window.addEventListener('resize', onResize)

    let rafId = 0
    const tick = (t: number) => {
      mouse.x += (target.x - mouse.x) * 0.07
      mouse.y += (target.y - mouse.y) * 0.07

      wireGroup.rotation.y = t * 0.00018 + mouse.x * 0.5
      wireGroup.rotation.x = mouse.y * 0.35
      particles.rotation.y = t * 0.00005

      camera.position.x = mouse.x * 1.2
      camera.position.y = 0.4 - mouse.y * 0.6
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)

      rafId = reduced ? 0 : requestAnimationFrame(tick)
    }

    if (reduced) {
      renderer.render(scene, camera)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      if (isBackground) {
        window.removeEventListener('pointermove', onPointerMove)
      } else {
        container.removeEventListener('pointermove', onPointerMove)
      }

      particleGeometry.dispose()
      particleMaterial.dispose()
      cubeGeometry.dispose()
      grid.geometry.dispose()
      grid.material?.dispose?.()
      for (const child of wireGroup.children) {
        const mat = (child as unknown as { material?: MaterialLike }).material
        mat?.dispose?.()
      }

      renderer.dispose()
    }
  }, [palette, variant])

  const shellClass =
    variant === 'background'
      ? `relative w-full overflow-hidden border-0 bg-transparent shadow-none backdrop-blur-0 ${className ?? ''}`
      : `cyber-glass cyber-neon-border relative w-full overflow-hidden ${className ?? ''}`

  return (
    <section ref={containerRef} aria-hidden="true" className={shellClass}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {variant === 'inline' && (
        <div className="relative z-10 flex h-full items-end justify-between gap-4 p-6">
          <div className="flex flex-col gap-1">
            <div className="cyber-muted text-xs">LIL BYTE // DREAMS</div>
            <div className="font-heading cyber-ps1 cyber-text-glow text-pale-sky-900 text-2xl font-bold">
              Neo Neon Selection
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
