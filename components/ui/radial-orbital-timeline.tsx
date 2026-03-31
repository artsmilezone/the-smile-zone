'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Layers, Brain, Star, TrendingUp, Target } from 'lucide-react'

// Icons are defined here so no functions are passed from Server → Client
const DIMENSION_ICONS: Record<number, React.ElementType> = {
  1: Layers,
  2: Brain,
  3: Star,
  4: TrendingUp,
  5: Target,
}
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface DimensionItem {
  id: number
  title: string
  label: string
  content: string
  relatedIds: number[]
  energy: number
}

interface RadialOrbitalTimelineProps {
  timelineData: DimensionItem[]
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [rotationAngle, setRotationAngle]   = useState(0)
  const [autoRotate, setAutoRotate]         = useState(true)
  const [pulseEffect, setPulseEffect]       = useState<Record<number, boolean>>({})
  const [activeNodeId, setActiveNodeId]     = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const orbitRef     = useRef<HTMLDivElement>(null)
  const nodeRefs     = useRef<Record<number, HTMLDivElement | null>>({})

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({})
      setActiveNodeId(null)
      setPulseEffect({})
      setAutoRotate(true)
    }
  }

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {}
      Object.keys(prev).forEach((k) => { newState[parseInt(k)] = false })
      newState[id] = !prev[id]

      if (!prev[id]) {
        setActiveNodeId(id)
        setAutoRotate(false)
        const related = timelineData.find((i) => i.id === id)?.relatedIds ?? []
        const pulses: Record<number, boolean> = {}
        related.forEach((r) => { pulses[r] = true })
        setPulseEffect(pulses)
      } else {
        setActiveNodeId(null)
        setAutoRotate(true)
        setPulseEffect({})
      }
      return newState
    })
  }

  useEffect(() => {
    if (!autoRotate) return
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)))
    }, 50)
    return () => clearInterval(timer)
  }, [autoRotate])

  const calculateNodePosition = (index: number, total: number) => {
    const angle  = ((index / total) * 360 + rotationAngle) % 360
    const radian = (angle * Math.PI) / 180
    const radius = 170
    const x      = radius * Math.cos(radian)
    const y      = radius * Math.sin(radian)
    const zIndex  = Math.round(100 + 50 * Math.cos(radian))
    const opacity = Math.max(0.55, Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2)))
    return { x, y, zIndex, opacity }
  }

  const isRelatedToActive = (itemId: number) =>
    activeNodeId !== null &&
    (timelineData.find((i) => i.id === activeNodeId)?.relatedIds.includes(itemId) ?? false)

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-visible"
      style={{ height: '480px' }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className="absolute w-full h-full flex items-center justify-center"
        ref={orbitRef}
        style={{ perspective: '1000px' }}
      >
        {/* ── Center orb ─────────────────────────────────────────── */}
        <div className="absolute z-10 flex items-center justify-center" style={{ width: 64, height: 64 }}>
          <div
            className="absolute rounded-full animate-ping opacity-60"
            style={{ width: 80, height: 80, border: '1px solid rgba(59,159,224,0.3)' }}
          />
          <div
            className="absolute rounded-full animate-ping opacity-30"
            style={{ width: 96, height: 96, border: '1px solid rgba(59,159,224,0.18)', animationDelay: '0.6s' }}
          />
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(59,159,224,0.9) 0%, rgba(45,74,168,0.8) 60%, rgba(6,16,32,0.9) 100%)' }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: 'rgba(157,216,245,0.85)', backdropFilter: 'blur(8px)' }}
            />
          </div>
        </div>

        {/* ── Orbit ring ─────────────────────────────────────────── */}
        <div
          className="absolute rounded-full"
          style={{ width: 340, height: 340, border: '1px solid rgba(59,159,224,0.28)' }}
        />

        {/* ── Nodes ──────────────────────────────────────────────── */}
        {timelineData.map((item, index) => {
          const pos        = calculateNodePosition(index, timelineData.length)
          const isExpanded = expandedItems[item.id]
          const isRelated  = isRelatedToActive(item.id)
          const isPulsing  = pulseEffect[item.id]
          const Icon       = DIMENSION_ICONS[item.id] ?? Layers

          return (
            <div
              key={item.id}
              ref={(el) => { nodeRefs.current[item.id] = el }}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex:  isExpanded ? 200 : pos.zIndex,
                opacity: isExpanded ? 1   : pos.opacity,
              }}
              onClick={(e) => { e.stopPropagation(); toggleItem(item.id) }}
            >
              {/* Glow halo */}
              <div
                className={`absolute rounded-full ${isPulsing ? 'animate-pulse' : ''}`}
                style={{
                  width:      item.energy * 0.4 + 44,
                  height:     item.energy * 0.4 + 44,
                  left:  -((item.energy * 0.4 + 44 - 40) / 2),
                  top:   -((item.energy * 0.4 + 44 - 40) / 2),
                  background: 'radial-gradient(circle, rgba(59,159,224,0.32) 0%, transparent 70%)',
                }}
              />

              {/* Node circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'scale-150' : ''}`}
                style={{
                  background: isExpanded ? '#3B9FE0' : isRelated ? 'rgba(59,159,224,0.45)' : 'rgba(15,35,70,0.95)',
                  border:     isExpanded ? '2px solid #9DD8F5' : isRelated ? '2px solid #3B9FE0' : '2px solid rgba(59,159,224,0.70)',
                  boxShadow:  isExpanded ? '0 0 20px rgba(59,159,224,0.6)' : isRelated ? '0 0 12px rgba(59,159,224,0.35)' : '0 0 8px rgba(59,159,224,0.18)',
                  color:      isExpanded ? '#fff' : '#C8E9F8',
                }}
              >
                <Icon size={17} />
              </div>

              {/* Label below node */}
              <div
                className="absolute whitespace-nowrap font-semibold tracking-wide transition-all duration-300"
                style={{
                  top:       44,
                  left:      '50%',
                  transform: 'translateX(-50%)',
                  color:     isExpanded ? '#fff' : 'rgba(255,255,255,0.88)',
                  fontSize:  isExpanded ? '0.75rem' : '0.68rem',
                }}
              >
                {item.title}
              </div>

              {/* ── Expanded popup (shadcn Card + Badge) ─────────── */}
              {isExpanded && (
                <Card
                  className="absolute overflow-visible"
                  style={{
                    top:           60,
                    left:          '50%',
                    transform:     'translateX(-50%)',
                    width:         248,
                    zIndex:        300,
                    background:    'rgba(7,14,26,0.97)',
                    border:        '1px solid rgba(59,159,224,0.35)',
                    borderRadius:  '14px',
                    boxShadow:     '0 8px 32px rgba(0,0,0,0.65), 0 0 24px rgba(59,159,224,0.08)',
                    backdropFilter:'blur(20px)',
                  }}
                >
                  {/* Connector pin */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3"
                    style={{ background: 'rgba(59,159,224,0.5)' }}
                  />

                  <CardHeader className="pb-2 pt-4 px-4">
                    <Badge
                      className="w-fit text-xs font-bold uppercase tracking-widest"
                      style={{
                        background:   'rgba(59,159,224,0.15)',
                        color:        '#9DD8F5',
                        border:       '1px solid rgba(59,159,224,0.28)',
                        borderRadius: '100px',
                        padding:      '2px 10px',
                      }}
                    >
                      {item.label}
                    </Badge>
                    <CardTitle
                      className="mt-2 font-bold"
                      style={{ fontSize: '0.875rem', color: '#fff', lineHeight: 1.3 }}
                    >
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 pt-0">
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>
                      {item.content}
                    </p>

                    {/* Focus bar */}
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(59,159,224,0.12)' }}>
                      <div
                        className="flex justify-between mb-1.5"
                        style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                      >
                        <span>Focus Level</span>
                        <span>{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.energy}%`, background: 'linear-gradient(90deg, #3B9FE0, #2d4aa8)' }}
                        />
                      </div>
                    </div>

                    {/* Connected dimensions */}
                    {item.relatedIds.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(59,159,224,0.12)' }}>
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                          Connected
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.relatedIds.map((relId) => {
                            const rel = timelineData.find((i) => i.id === relId)
                            return (
                              <Button
                                key={relId}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 py-0 text-xs cursor-pointer flex items-center gap-1"
                                style={{
                                  background:   'transparent',
                                  border:       '1px solid rgba(59,159,224,0.28)',
                                  color:        'rgba(157,216,245,0.85)',
                                  borderRadius: '4px',
                                }}
                                onClick={(e) => { e.stopPropagation(); toggleItem(relId) }}
                              >
                                {rel?.title}
                                <ArrowRight size={8} />
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
