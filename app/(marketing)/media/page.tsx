import type { Metadata } from 'next'
import Link from 'next/link'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Media — The S.M.I.L.E. Zone',
  description:
    'Watch videos from The S.M.I.L.E. Zone. Meet the coaches, hear from MLB veterans, and see what mental performance training looks like in action.',
}

const VIDEOS = [
  {
    id: 'SJ97cCG9Hqo',
    title: 'Meet Coach Edgar Olmos',
    description: 'Former MLB pitcher and international competitor on building mental strength.',
  },
  {
    id: 'aXeNKOUWIgg',
    title: 'Meet Coach Trayvon Robinson',
    description: 'Former Dodgers & Orioles outfielder on accountability and hard work.',
  },
  {
    id: 'wcLFxzrWq1c',
    title: 'Meet Coach Jaylin Davis',
    description: 'Former Giants & Twins outfielder on game-day mindset and preparation.',
  },
  {
    id: 'zmw9R5si19o',
    title: 'Meet Coach Jay Jackson',
    description: '17-year MLB veteran and S.M.I.L.E. Zone founder on intentional growth.',
  },
  {
    id: 'Mwx3XHRaUxk',
    title: 'Download SmileZone & Elevate Your Game',
    description: 'See the platform in action and start your mental performance journey.',
  },
]

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://youtube.com/@SmilezoneApp',
    handle: '@SmilezoneApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: '#FF0000',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/Smile_zoneapp',
    handle: '@Smile_zoneapp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    color: '#E1306C',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@SmilezoneApp',
    handle: '@SmilezoneApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z" />
      </svg>
    ),
    color: '#69C9D0',
  },
]

export default function MediaPage() {
  return (
    <main style={{ background: '#070e1a', minHeight: '100vh' }}>

      {/* Header */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(160deg, #0d1b2e 0%, #070e1a 100%)',
          borderBottom: '1px solid rgba(59,159,224,0.10)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
          Videos & Social
        </p>
        <h1
          className="font-bebas text-white"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', letterSpacing: '0.04em' }}
        >
          Media
        </h1>
        <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Meet the coaches and see S.M.I.L.E. Zone mental performance training in action.
        </p>
      </section>

      {/* Videos */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-bebas text-white mb-10"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', letterSpacing: '0.04em' }}
          >
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map(({ id, title, description }, i) => (
              <RevealOnScroll key={id} delay={i * 60}>
              <div
                className="rounded-2xl overflow-hidden flex flex-col smz-card-hover"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* YouTube embed */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
                {/* Caption */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1" style={{ fontSize: '0.9375rem' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
                </div>
              </div>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://youtube.com/@SmilezoneApp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
              style={{
                background: 'rgba(255,0,0,0.12)',
                color: '#FF6B6B',
                border: '1px solid rgba(255,0,0,0.20)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              View All Videos on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="py-16 px-4" style={{ background: '#0a1220' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-bebas text-white mb-8"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', letterSpacing: '0.04em' }}
          >
            Follow Along
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIALS.map(({ label, href, handle, icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer smz-card-hover"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{ color }}>{icon}</div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ borderTop: '1px solid rgba(59,159,224,0.10)' }}>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Ready to take the next step?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/assessment"
            className="px-6 py-3 rounded-full font-bold text-sm cursor-pointer"
            style={{ background: '#3B9FE0', color: '#fff' }}
          >
            Free Assessment →
          </Link>
          <Link
            href="/community"
            className="px-6 py-3 rounded-full font-bold text-sm cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            Join the Community
          </Link>
        </div>
      </section>

    </main>
  )
}
