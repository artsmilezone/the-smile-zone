import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return BLOG_POSTS.filter((p) => p.type === 'original').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — The S.M.I.L.E. Zone`,
    description: post.excerpt,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Mental Mindset': '#3B9FE0',
  'Foundation':     '#10b981',
  'Resilience':     '#8B5CF6',
  'Leadership':     '#f59e0b',
  'Curated':        '#6b7280',
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post || post.type !== 'original') notFound()

  const color = CATEGORY_COLORS[post.category] ?? '#3B9FE0'

  // Related posts — same category, excluding current
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2)

  return (
    <main style={{ background: '#070e1a', minHeight: '100vh' }}>

      {/* ── Article header ───────────────────────────────────────────────── */}
      <section
        className="py-16 px-4"
        style={{
          background: 'linear-gradient(160deg, #0d1b2e 0%, #070e1a 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 cursor-pointer blog-back-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>

          {/* Category + read time */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                background: `${color}22`,
                color,
                border: `1px solid ${color}44`,
              }}
            >
              {post.category}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.readTime}</span>
          </div>

          {/* Title */}
          <h1
            className="font-bebas text-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.03em', lineHeight: 1.1 }}
          >
            {post.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-sm shrink-0"
              style={{
                background: `${post.authorColor}22`,
                color: post.authorColor,
                border: `1.5px solid ${post.authorColor}44`,
                letterSpacing: '0.05em',
              }}
              aria-hidden="true"
            >
              {post.authorInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {post.authorRole} &middot; {formatDate(post.date)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/*
            Safety: post.content is static, coach-authored HTML from lib/blog-posts.ts.
            It is never user-supplied and is not stored in or retrieved from the database.
            No sanitization needed — this is equivalent to writing JSX inline.
          */}
          <div
            className="blog-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>
      </section>

      {/* ── Related posts ────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          className="py-12 px-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              More from {post.category}
            </p>
            <div className="flex flex-col gap-4">
              {related.map((r) => {
                const rColor = CATEGORY_COLORS[r.category] ?? '#3B9FE0'
                const href = r.type === 'link' ? (r.externalUrl ?? '#') : `/blog/${r.slug}`
                const isExt = r.type === 'link'
                return (
                  <a
                    key={r.slug}
                    href={href}
                    target={isExt ? '_blank' : undefined}
                    rel={isExt ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer blog-related-item"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bebas shrink-0"
                      style={{
                        background: `${r.authorColor}22`,
                        color: r.authorColor,
                        border: `1.5px solid ${r.authorColor}44`,
                        letterSpacing: '0.05em',
                      }}
                      aria-hidden="true"
                    >
                      {r.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-sky-300 transition-colors duration-200">
                        {r.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {r.author} &middot; {r.readTime}
                      </p>
                    </div>
                    <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Assessment CTA ───────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div
          className="max-w-2xl mx-auto rounded-2xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0d2347 100%)',
            border: '1px solid rgba(59,159,224,0.15)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9DD8F5' }}>
            Ready to level up?
          </p>
          <h2
            className="font-bebas text-white mb-3"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', letterSpacing: '0.04em' }}
          >
            Discover Your Mental Performance Profile
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Take the free S.M.I.L.E. Zone assessment and get a personalized report built around your actual responses.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm cursor-pointer"
            style={{
              background: '#3B9FE0',
              boxShadow: '0 4px 20px rgba(59,159,224,0.35)',
              transition: 'background 0.15s ease',
            }}
          >
            Take the Assessment
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

    </main>
  )
}
