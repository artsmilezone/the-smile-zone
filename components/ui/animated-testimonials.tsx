'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

// Stable rotations — no randomness to avoid hydration mismatch
const ROTATIONS = [-6, 7, -4, 8, -5, 6]

export function AnimatedTestimonials({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[]
  autoplay?: boolean
}) {
  const [active, setActive] = useState(0)

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return
    const interval = setInterval(handleNext, 5500)
    return () => clearInterval(interval)
  }, [autoplay, handleNext])

  const isActive = (index: number) => index === active

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-center">

        {/* ── Stacked image stack ──────────────────────────────── */}
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-[280px]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    y: 40,
                    rotate: `${ROTATIONS[index % ROTATIONS.length]}deg`,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.38,
                    scale: isActive(index) ? 1 : 0.88,
                    y: isActive(index) ? 0 : 18,
                    zIndex: isActive(index)
                      ? testimonials.length
                      : testimonials.length - Math.abs(index - active),
                    rotate: isActive(index)
                      ? '0deg'
                      : `${ROTATIONS[index % ROTATIONS.length]}deg`,
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: -40 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div
                    className="relative h-full w-full rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: isActive(index)
                        ? '0 0 48px rgba(59,159,224,0.14), 0 24px 48px rgba(0,0,0,0.65)'
                        : '0 8px 24px rgba(0,0,0,0.4)',
                      border: isActive(index)
                        ? '1.5px solid rgba(59,159,224,0.42)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Image
                      src={testimonial.src}
                      alt={testimonial.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 280px, 280px"
                      draggable={false}
                    />
                    {/* Bottom gradient fade */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(7,14,26,0.55) 0%, transparent 100%)',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Quote + controls ─────────────────────────────────── */}
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.32, ease: 'easeInOut' }}
            >
              {/* Decorative quote mark */}
              <div
                className="font-bebas leading-none mb-3 select-none"
                style={{ fontSize: '5rem', color: 'rgba(59,159,224,0.22)', lineHeight: 1 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <p
                className="text-base sm:text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.76)' }}
              >
                {testimonials[active].quote}
              </p>

              <div style={{ borderTop: '1px solid rgba(59,159,224,0.15)', paddingTop: '1.25rem' }}>
                <p className="font-bold text-white" style={{ fontSize: '1rem' }}>
                  {testimonials[active].name}
                </p>
                <p
                  className="text-xs uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(59,159,224,0.65)' }}
                >
                  {testimonials[active].designation}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav controls */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
              style={{
                background: 'rgba(59,159,224,0.10)',
                border: '1px solid rgba(59,159,224,0.28)',
              }}
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                style={{ color: '#9DD8F5' }}
              />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
              style={{
                background: 'rgba(59,159,224,0.10)',
                border: '1px solid rgba(59,159,224,0.28)',
              }}
            >
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: '#9DD8F5' }}
              />
            </button>

            {/* Pill dot indicators */}
            <div className="flex items-center gap-1.5 ml-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="cursor-pointer"
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? '18px' : '5px',
                      height: '5px',
                      background:
                        i === active ? '#3B9FE0' : 'rgba(59,159,224,0.22)',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
