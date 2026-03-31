'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselImage {
  src: string
  alt: string
  label?: string
}

interface FeatureCarouselProps {
  images: CarouselImage[]
  className?: string
  autoPlayInterval?: number
}

export function FeatureCarousel({
  images,
  className,
  autoPlayInterval = 3800,
}: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(Math.floor(images.length / 2))

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  React.useEffect(() => {
    const timer = setInterval(handleNext, autoPlayInterval)
    return () => clearInterval(timer)
  }, [handleNext, autoPlayInterval])

  const activeLabel = images[currentIndex]?.label

  return (
    <div className={cn('relative w-full select-none', className)}>
      {/* Carousel viewport */}
      <div
        className="relative h-[400px] md:h-[480px] flex items-center justify-center"
        style={{ perspective: '1100px' }}
      >
        {/* Ambient glow behind center card */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '200px',
            height: '340px',
            background: 'radial-gradient(ellipse, rgba(59,159,224,0.18) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }}
          aria-hidden="true"
        />

        {images.map((image, index) => {
          const offset = index - currentIndex
          const total = images.length
          let pos = (offset + total) % total
          if (pos > Math.floor(total / 2)) pos = pos - total

          const isCenter = pos === 0
          const isAdjacent = Math.abs(pos) === 1

          return (
            <div
              key={index}
              className="absolute transition-all duration-500 ease-in-out"
              style={{
                width: 'clamp(148px, 22vw, 200px)',
                height: 'clamp(260px, 38vw, 360px)',
                transform: `translateX(${pos * 46}%) scale(${isCenter ? 1 : isAdjacent ? 0.80 : 0.62}) rotateY(${pos * -14}deg)`,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.32 : 0,
                filter: isCenter ? 'none' : 'blur(2px)',
                visibility: Math.abs(pos) > 1 ? 'hidden' : 'visible',
              }}
              aria-hidden={!isCenter}
            >
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{
                  border: isCenter
                    ? '1.5px solid rgba(59,159,224,0.50)'
                    : '1px solid rgba(59,159,224,0.12)',
                  boxShadow: isCenter
                    ? '0 0 48px rgba(59,159,224,0.18), 0 24px 48px rgba(0,0,0,0.5)'
                    : '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 148px, 200px"
                  priority={isCenter}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-[calc(50%-24px)] -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{
          background: 'rgba(59,159,224,0.12)',
          border: '1px solid rgba(59,159,224,0.28)',
          color: '#9DD8F5',
        }}
        aria-label="Previous feature"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-[calc(50%-24px)] -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{
          background: 'rgba(59,159,224,0.12)',
          border: '1px solid rgba(59,159,224,0.28)',
          color: '#9DD8F5',
        }}
        aria-label="Next feature"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Active label */}
      {activeLabel && (
        <div className="mt-5 flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: 'rgba(59,159,224,0.10)',
              color: '#9DD8F5',
              border: '1px solid rgba(59,159,224,0.22)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#3B9FE0' }}
              aria-hidden="true"
            />
            {activeLabel}
          </div>
        </div>
      )}

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Carousel slides">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            className="cursor-pointer transition-all duration-300 flex items-center"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? '18px' : '5px',
                height: '5px',
                background: i === currentIndex ? '#3B9FE0' : 'rgba(59,159,224,0.22)',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
