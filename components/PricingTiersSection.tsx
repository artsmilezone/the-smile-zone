'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import Image from 'next/image'
import RevealOnScroll from '@/components/RevealOnScroll'

const COMMUNITY_URL = 'https://the-smile-zone.mn.co'

interface Tier {
  tier: string
  plan: string
  tag: string | null
  photo: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  best: string
  highlight: boolean
}

const TIERS: Tier[] = [
  {
    tier: 'Mental Mindset Locker Room',
    plan: 'S.M.I.L.E. Plan',
    tag: null,
    photo: '/plans/smile-plan.png',
    monthlyPrice: 19.99,
    yearlyPrice: 219.99,
    features: [
      'Mental mindset & Baseball IQ',
      'Daily posts',
      'A community built around intentional effort',
    ],
    best: 'Athletes who want mindset reps, confidence, and a weekly mental process.',
    highlight: false,
  },
  {
    tier: 'Foundation',
    plan: 'Starter Plan',
    tag: null,
    photo: '/plans/starter-plan.png',
    monthlyPrice: 34.99,
    yearlyPrice: 384.99,
    features: [
      'Full access to S.M.I.L.E. curriculum',
      'Weekly lessons and quizzes',
      'Accountability & assignments',
    ],
    best: 'Your athlete needs structure, confidence, and a stronger mental foundation.',
    highlight: false,
  },
  {
    tier: 'Measurable Progress',
    plan: 'Growth Plan',
    tag: 'Most Popular',
    photo: '/plans/growth-plan.png',
    monthlyPrice: 149.99,
    yearlyPrice: 1649.99,
    features: [
      'Everything in Starter',
      '1 monthly mentorship hour with your coach',
      'Personalized written performance notes',
      'Increased accountability',
      'Signed book & Satellite app trial',
    ],
    best: 'Your athlete is ready for consistent coaching and measurable improvement.',
    highlight: true,
  },
  {
    tier: 'Serious Competitors',
    plan: 'Elite Plan',
    tag: null,
    photo: '/plans/elite-plan.png',
    monthlyPrice: 224.99,
    yearlyPrice: 2749.99,
    features: [
      'Everything in Growth + Starter',
      '2 monthly mentorship hours with your coach',
      'Monthly film breakdown review',
      'Quarterly parent feedback session',
    ],
    best: 'Athletes pursuing varsity, college, or higher level opportunities.',
    highlight: false,
  },
  {
    tier: 'Maximum Support',
    plan: 'M.V.P. Plan',
    tag: 'Top Tier',
    photo: '/plans/mvp-plan.png',
    monthlyPrice: 429.99,
    yearlyPrice: 4649.99,
    features: [
      'Everything in Elite + Growth + Starter',
      '4 monthly mentorship hours with your coach',
      '2–3 film breakdown reviews per month',
      'Monthly team coaching call',
    ],
    best: 'Your athlete wants personalized coaching and the highest level of support.',
    highlight: false,
  },
]

// ── Pricing Toggle ────────────────────────────────────────────────────────────

function PricingToggle({ isYearly, onToggle }: { isYearly: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="flex justify-center">
      <div
        className="relative flex p-1 rounded-full"
        style={{
          background: 'rgba(13,27,46,0.06)',
          border: '1px solid rgba(59,159,224,0.18)',
        }}
      >
        {/* Monthly */}
        <button
          onClick={() => onToggle(false)}
          className="relative z-10 px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer"
          style={{ color: !isYearly ? '#fff' : '#6B7280' }}
        >
          {!isYearly && (
            <motion.span
              layoutId="pricing-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: '#0d1b2e', boxShadow: '0 2px 12px rgba(13,27,46,0.25)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        {/* Yearly */}
        <button
          onClick={() => onToggle(true)}
          className="relative z-10 px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2"
          style={{ color: isYearly ? '#fff' : '#6B7280' }}
        >
          {isYearly && (
            <motion.span
              layoutId="pricing-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: '#0d1b2e', boxShadow: '0 2px 12px rgba(13,27,46,0.25)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative">Annual</span>
          <span
            className="relative text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: isYearly ? 'rgba(59,159,224,0.20)' : 'rgba(59,159,224,0.10)',
              color: isYearly ? '#9DD8F5' : '#3B9FE0',
            }}
          >
            Save up to 10%
          </span>
        </button>
      </div>
    </div>
  )
}

// ── Checkmark icon ────────────────────────────────────────────────────────────

function CheckIcon({ light }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="rgba(16,185,129,0.35)" />
      <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PricingTiersSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section
      className="py-20 px-4"
      style={{ background: '#F0F5FA', borderTop: '1px solid rgba(59,159,224,0.12)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <RevealOnScroll className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
            Choose Your Level
          </p>
          <h2
            className="font-bebas"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', letterSpacing: '0.04em', color: '#0d1b2e' }}
          >
            Choose Your Level of Support
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#4B6280' }}>
            Cancel anytime. No long-term contracts required.
          </p>
        </RevealOnScroll>

        {/* Toggle */}
        <RevealOnScroll delay={80} className="mb-10">
          <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
        </RevealOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIERS.map(({ tier, plan, tag, photo, monthlyPrice, yearlyPrice, features, best, highlight }, i) => {
            const price = isYearly ? yearlyPrice : monthlyPrice
            const period = isYearly ? 'yr' : 'mo'
            const monthlyCost = monthlyPrice * 12
            const annualSavings = parseFloat((monthlyCost - yearlyPrice).toFixed(2))
            const discountPct = Math.round((annualSavings / monthlyCost) * 100)

            return (
              <RevealOnScroll key={tier} delay={i * 60}>
                <div className="relative pt-4 h-full">
                  {/* Badge */}
                  {tag && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                      style={{ background: '#3B9FE0', color: '#fff' }}
                    >
                      {tag}
                    </div>
                  )}

                  <div
                    className={`p-6 rounded-2xl flex flex-col h-full smz-card-hover${highlight ? ' smz-card-shimmer' : ''}`}
                    style={{
                      background: highlight ? 'linear-gradient(160deg, #0d1b2e 0%, #162540 100%)' : '#FFFFFF',
                      border: highlight ? '1px solid rgba(59,159,224,0.35)' : '1px solid rgba(59,159,224,0.15)',
                      boxShadow: highlight ? '0 8px 32px rgba(13,27,46,0.18)' : '0 2px 12px rgba(13,27,46,0.06)',
                    }}
                  >
                    {/* Plan header */}
                    <div className="flex items-center gap-3 mb-4">
                      <Image src={photo} alt={plan} width={48} height={48} className="object-contain shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: highlight ? '#9DD8F5' : '#3B9FE0' }}>
                          {tier}
                        </p>
                        <h3 className="font-bold" style={{ fontSize: '1.05rem', color: highlight ? '#FFFFFF' : '#0d1b2e' }}>
                          {plan}
                        </h3>
                      </div>
                    </div>

                    {/* Price block */}
                    <div
                      className="mb-4 pb-4"
                      style={{ borderBottom: highlight ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(59,159,224,0.12)' }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-3xl font-black"
                          style={{ color: highlight ? '#FFFFFF' : '#0d1b2e', fontFeatureSettings: '"tnum"' }}
                        >
                          $<NumberFlow
                            value={price}
                            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            className="text-3xl font-black"
                          />
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: highlight ? 'rgba(255,255,255,0.50)' : '#8FA8C0' }}
                        >
                          /{period}
                        </span>
                      </div>
                      {isYearly && annualSavings > 0 && (
                        <p
                          className="text-xs mt-1 font-medium"
                          style={{ color: highlight ? 'rgba(157,216,245,0.75)' : '#3B9FE0' }}
                        >
                          {discountPct}% discount of ${annualSavings.toFixed(2)} from monthly billing
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2 mb-4 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm" style={{ color: highlight ? 'rgba(255,255,255,0.72)' : '#374151' }}>
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Best for */}
                    <p className="text-xs italic mb-4" style={{ color: highlight ? 'rgba(255,255,255,0.42)' : '#6B7280' }}>
                      Best for: {best}
                    </p>

                    {/* CTA */}
                    <a
                      href={COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2.5 rounded-full text-sm font-bold cursor-pointer"
                      style={
                        highlight
                          ? { background: '#3B9FE0', color: '#fff', transition: 'background 0.15s ease' }
                          : { background: 'rgba(13,27,46,0.06)', color: '#0d1b2e', border: '1px solid rgba(13,27,46,0.14)', transition: 'background 0.15s ease' }
                      }
                    >
                      Join Community
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
