'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-posts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface BlogGridProps {
  posts: BlogPost[]
  categories: string[]
  categoryColors: Record<string, string>
}

export default function BlogGrid({ posts, categories, categoryColors }: BlogGridProps) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active)

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Category filter ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
          {categories.map((cat) => {
            const isActive = cat === active
            const color = categoryColors[cat] ?? '#3B9FE0'
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200"
                style={{
                  background: isActive ? `${color}22` : 'rgba(255,255,255,0.04)',
                  color: isActive ? color : 'rgba(255,255,255,0.45)',
                  border: isActive ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.08)',
                }}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <p className="text-center py-20 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No posts in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} categoryColors={categoryColors} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PostCard({ post, categoryColors }: { post: BlogPost; categoryColors: Record<string, string> }) {
  const color = categoryColors[post.category] ?? '#3B9FE0'
  const isExternal = post.type === 'link'

  const cardContent = (
    <div
      className="group h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer smz-card-hover"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = `${color}33`
        el.style.boxShadow = `0 4px 24px ${color}12`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}80 0%, transparent 100%)` }} aria-hidden="true" />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Category + external badge */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}35`,
            }}
          >
            {post.category}
          </span>
          {isExternal && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              aria-label="External article"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              {post.externalSource}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-bold text-white leading-snug group-hover:text-sky-300 transition-colors duration-200"
          style={{ fontSize: '1rem' }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bebas shrink-0"
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
              <p className="text-xs font-semibold text-white leading-tight">{post.author}</p>
              <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {formatDate(post.date)}
              </p>
            </div>
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {post.readTime}
          </span>
        </div>

        {/* CTA */}
        <div
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 group-hover:gap-2.5"
          style={{ color }}
        >
          {isExternal ? 'Read Article' : 'Read More'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  )

  if (isExternal) {
    return (
      <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      {cardContent}
    </Link>
  )
}
