import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Meet the Team', href: '/team' },
  { label: 'Community', href: '/community' },
  { label: 'Media', href: '/media' },
  { label: 'Assessment', href: '/assessment' },
]

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://youtube.com/@SmilezoneApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/Smile_zoneapp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@SmilezoneApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z" />
      </svg>
    ),
  },
]

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: '#070e1a',
        borderTop: '1px solid rgba(59,159,224,0.12)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/smz-logo.png" alt="S.M.I.L.E. Zone" width={32} height={32} />
              <span
                className="font-bebas text-white"
                style={{ fontSize: '1.1rem', letterSpacing: '0.06em' }}
              >
                S.M.I.L.E. Zone
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Start Making Intentional Life Effort.
              <br />
              Mindset + performance for baseball athletes.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="smz-footer-social cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Navigation
            </p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors duration-150 cursor-pointer"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Contact
            </p>
            <a
              href="mailto:smileyj@the-smile-zone.com"
              className="text-sm transition-colors duration-150 cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              smileyj@the-smile-zone.com
            </a>
            <div className="mt-6">
              <Link
                href="/assessment"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-opacity duration-150"
                style={{ background: '#3B9FE0', color: '#fff' }}
              >
                Free Assessment →
              </Link>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}
        >
          <span>© {new Date().getFullYear()} The S.M.I.L.E. Zone. All rights reserved.</span>
          <span>Built by Jay Jackson</span>
        </div>
      </div>
    </footer>
  )
}
