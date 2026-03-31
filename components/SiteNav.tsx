'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Meet the Team', href: '/team' },
  { label: 'Community', href: '/community' },
  { label: 'Media', href: '/media' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(18,38,65,0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(59,159,224,0.12)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/smz-logo.png"
            alt="The S.M.I.L.E. Zone"
            width={36}
            height={36}
            className="drop-shadow"
          />
          <span
            className="font-bebas text-white hidden sm:block"
            style={{ fontSize: '1.25rem', letterSpacing: '0.06em' }}
          >
            S.M.I.L.E. Zone
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="smz-nav-link px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  color: active ? '#9DD8F5' : 'rgba(255,255,255,0.7)',
                  background: active ? 'rgba(59,159,224,0.10)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold cursor-pointer"
            style={{
              background: '#3B9FE0',
              color: '#fff',
              boxShadow: '0 2px 12px rgba(59,159,224,0.35)',
              transition: 'background 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#1D7BBF'
              el.style.boxShadow = '0 4px 20px rgba(59,159,224,0.50)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#3B9FE0'
              el.style.boxShadow = '0 2px 12px rgba(59,159,224,0.35)'
            }}
          >
            Take the Assessment
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.8)',
                transform: open ? 'rotate(45deg) translate(2px, 5px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.8)',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.8)',
                transform: open ? 'rotate(-45deg) translate(2px, -5px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu — smooth slide with max-height transition */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: open ? '360px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.28s ease, opacity 0.2s ease',
          borderTop: open ? '1px solid rgba(59,159,224,0.10)' : 'none',
          background: 'rgba(15,28,52,0.98)',
        }}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="smz-nav-link px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  color: active ? '#9DD8F5' : 'rgba(255,255,255,0.85)',
                  background: active ? 'rgba(59,159,224,0.10)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/assessment"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-3 rounded-full text-sm font-bold text-center cursor-pointer"
            style={{ background: '#3B9FE0', color: '#fff' }}
          >
            Take the Assessment
          </Link>
        </div>
      </div>
    </header>
  )
}
