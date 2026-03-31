import type { Metadata } from 'next'
import Link from 'next/link'
import RevealOnScroll from '@/components/RevealOnScroll'
import { BLOG_POSTS, CATEGORIES, getFeaturedPost } from '@/lib/blog-posts'
import BlogGrid from './_components/BlogGrid'

export const metadata: Metadata = {
  title: 'Blog — The S.M.I.L.E. Zone',
  description:
    'Thought leadership, mental performance insights, and curated articles from the coaches and curriculum of The S.M.I.L.E. Zone baseball program.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Mental Mindset':  '#3B9FE0',
  'Foundation':      '#10b981',
  'Resilience':      '#8B5CF6',
  'Leadership':      '#f59e0b',
  'Curated':         '#6b7280',
}

export default function BlogPage() {
  const featured = getFeaturedPost()

  return (
    <main style={{ background: '#070e1a', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(160deg, #0d1b2e 0%, #070e1a 100%)',
          borderBottom: '1px solid rgba(59,159,224,0.10)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
          Insights & Ideas
        </p>
        <h1
          className="font-bebas text-white"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', letterSpacing: '0.04em' }}
        >
          The SMILE Zone Blog
        </h1>
        <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Thought leadership from our coaches. Articles on mental performance, leadership, and the mindset of elite athletes.
        </p>
      </section>

      {/* ── Featured Post ────────────────────────────────────────────────── */}
      {featured && (
        <section className="pt-16 pb-4 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Featured
            </p>
            <RevealOnScroll direction="up">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-2xl overflow-hidden cursor-pointer blog-featured-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,159,224,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(59,159,224,0.18)',
                }}
              >
                <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Category + read time */}
                  <div className="md:hidden flex items-center gap-3 mb-1">
                    <span
                      className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        background: `${CATEGORY_COLORS[featured.category]}22`,
                        color: CATEGORY_COLORS[featured.category],
                        border: `1px solid ${CATEGORY_COLORS[featured.category]}44`,
                      }}
                    >
                      {featured.category}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{featured.readTime}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="hidden md:flex items-center gap-3 mb-3">
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          background: `${CATEGORY_COLORS[featured.category]}22`,
                          color: CATEGORY_COLORS[featured.category],
                          border: `1px solid ${CATEGORY_COLORS[featured.category]}44`,
                        }}
                      >
                        {featured.category}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{featured.readTime}</span>
                    </div>

                    <h2
                      className="font-bebas text-white mb-3 group-hover:text-sky-300 transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '0.03em', lineHeight: 1.1 }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-5 max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {featured.excerpt}
                    </p>

                    {/* Author + date */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bebas shrink-0"
                        style={{
                          background: `${featured.authorColor}22`,
                          color: featured.authorColor,
                          border: `1.5px solid ${featured.authorColor}44`,
                          letterSpacing: '0.05em',
                        }}
                        aria-hidden="true"
                      >
                        {featured.authorInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{featured.author}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {formatDate(featured.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                    style={{ background: 'rgba(59,159,224,0.12)', border: '1px solid rgba(59,159,224,0.25)' }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B9FE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* ── All Posts (client component handles category filter) ─────────── */}
      <BlogGrid posts={BLOG_POSTS} categories={[...CATEGORIES]} categoryColors={CATEGORY_COLORS} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
            Take the Next Step
          </p>
          <h2
            className="font-bebas text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.04em' }}
          >
            Ready to Train Your Mental Game?
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            The S.M.I.L.E. Zone assessment gives you a personalized breakdown of your mental performance profile — and a roadmap for what to develop next.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white cursor-pointer"
            style={{
              background: '#3B9FE0',
              boxShadow: '0 4px 24px rgba(59,159,224,0.35)',
              transition: 'background 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            Take the Free Assessment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

    </main>
  )
}
