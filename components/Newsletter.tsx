'use client'

import { FormEvent, useState } from 'react'

/** Same endpoint MailerLite’s embed used; POST with `fields[email]` avoids full-page JSON navigation. */
const DEFAULT_SUBSCRIBE_URL =
  'https://assets.mailerlite.com/jsonp/2228429/forms/183187572753695779/subscribe'

type MailerLiteJson = {
  success: boolean
  errors?: { fields?: Record<string, string[]>; message?: string }
}

function getSubscribeUrl() {
  return process.env.NEXT_PUBLIC_MAILERLITE_SUBSCRIBE_URL?.trim() || DEFAULT_SUBSCRIBE_URL
}

export default function Newsletter({ className = '' }: { className?: string }) {
  const sectionClass = [
    'cyber-main-surface border-turquoise-surf-200/80 border-t p-8 text-center',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const body = new URLSearchParams()
    body.set('fields[email]', email.trim())

    try {
      const res = await fetch(getSubscribeUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: body.toString(),
      })

      const data = (await res.json()) as MailerLiteJson

      if (data.success) {
        setStatus('success')
        setMessage('Thanks! See you in your inbox')
        setEmail('')
        return
      }

      const fieldErr =
        data.errors?.fields && Object.values(data.errors.fields).flat().filter(Boolean)[0]
      setStatus('error')
      setMessage(fieldErr || data.errors?.message || 'Something went wrong. Please try again.')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="newsletter" className={sectionClass} aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" className="font-heading text-pale-sky-950 text-xl font-bold">
        Newsletter
      </h2>

      {status === 'success' ? (
        <p className="text-pale-sky-800 dark:text-pale-sky-200 mt-6 text-sm" role="status">
          {message}
        </p>
      ) : (
        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
          onSubmit={onSubmit}
          noValidate
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === 'loading'}
            className="border-turquoise-surf-300/80 bg-pale-sky-50/90 text-pale-sky-950 placeholder:text-pale-sky-500 focus:border-primary-500 focus:ring-primary-500/30 dark:bg-pale-sky-900/40 dark:text-pale-sky-100 flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500/40 text-pale-sky-50 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && message && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </p>
      )}
    </section>
  )
}
