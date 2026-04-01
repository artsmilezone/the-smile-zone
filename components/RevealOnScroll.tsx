'use client'
import { useEffect, useRef, ReactNode } from 'react'

type Direction = 'up' | 'left' | 'right' | 'scale'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  direction?: Direction
}

const CLASS_MAP: Record<Direction, string> = {
  up:    'smz-reveal',
  left:  'smz-reveal-from-left',
  right: 'smz-reveal-from-right',
  scale: 'smz-reveal-scale',
}

export default function RevealOnScroll({ children, delay = 0, className = '', direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          obs.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px 150px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${CLASS_MAP[direction]} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
