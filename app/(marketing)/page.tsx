import Image from 'next/image'
import Link from 'next/link'
import RevealOnScroll from '@/components/RevealOnScroll'
import { FeatureCarousel } from '@/components/ui/feature-carousel'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import ContactFormInline from '@/components/ContactFormInline'

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  { src: '/hero/SMILE-ZoneIntro.png',        alt: 'S.M.I.L.E. Zone platform overview',  label: 'Platform Overview' },
  { src: '/hero/Baseball-IQ.png',            alt: 'Baseball IQ assessment screen',       label: 'Baseball IQ' },
  { src: '/hero/Curriculum-Lesson-Quiz.png', alt: 'Curriculum lessons and quizzes',      label: 'Weekly Curriculum' },
  { src: '/hero/Master-Mind.png',            alt: 'Master Mind mental training',         label: 'Mental Training' },
  { src: '/hero/Mindset-LockerRoom.png',     alt: 'Mindset Locker Room community',       label: 'Locker Room' },
  { src: '/hero/Post-Survey.png',            alt: 'Progress tracking post-survey',       label: 'Progress Tracking' },
]

const VALUE_PROPS = [
  {
    title: 'Beyond Mechanics',
    body: 'Most programs teach what to do, but fail to teach athletes how to perform under pressure.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Mental Performance Training',
    body: 'A core focus that builds confidence, resilience, and real-world baseball impact.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
  {
    title: 'Systemized Accountability',
    body: 'Unlike coach-dependent models, this system ensures athletes stay on track through a structured curriculum.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Join the Zone', body: 'Get access to the full S.M.I.L.E. Zone platform and community.' },
  { step: '02', title: 'Follow the Weekly Curriculum', body: '48 weeks of mental performance lessons built by pro coaches.' },
  { step: '03', title: 'Apply During Training & Games', body: 'Take your mental reps from the classroom to the diamond.' },
  { step: '04', title: 'Accountability + Mentor Support', body: 'Structured check-ins and coaching touchpoints keep you on track.' },
  { step: '05', title: 'Long-Term Confidence & Identity', body: 'Build the mindset of a pro — on and off the field.' },
]

const DIMENSIONS = [
  {
    id: 1,
    title: 'Foundational',
    label: 'Dimension 1',
    content: 'The core mindset habits and self-awareness that serve as the bedrock for every aspect of athletic and personal development.',
    relatedIds: [2, 5],
    energy: 100,
  },
  {
    id: 2,
    title: 'Mental Resilience',
    label: 'Dimension 2',
    content: 'Building the mental toughness, composure, and pressure-handling skills that separate good athletes from great ones.',
    relatedIds: [1, 3],
    energy: 90,
  },
  {
    id: 3,
    title: 'Leadership Identity',
    label: 'Dimension 3',
    content: 'Developing the character, communication, and presence that elevates your team and defines who you are as a player.',
    relatedIds: [2, 4],
    energy: 80,
  },
  {
    id: 4,
    title: 'Legacy & Long-term Growth',
    label: 'Dimension 4',
    content: 'Playing with purpose beyond this season — building habits, values, and a story that endures long after the game.',
    relatedIds: [3, 5],
    energy: 75,
  },
  {
    id: 5,
    title: 'Your Commitment',
    label: 'Dimension 5',
    content: 'Personal accountability and daily execution of your development plan. The gap between knowing and doing — closed here.',
    relatedIds: [4, 1],
    energy: 85,
  },
]

const PRICING_TIERS = [
  {
    name: 'Foundation',
    plan: 'Starter Plan',
    features: ['Full access to S.M.I.L.E. curriculum', 'Weekly lessons and quizzes', 'Accountability & assignments'],
    highlight: false,
  },
  {
    name: 'Measurable Progress',
    plan: 'Growth Plan',
    features: ['Everything in Starter', '1 monthly mentorship hour', 'Personalized written performance notes', 'Signed book & Satellite app trial'],
    highlight: true,
  },
  {
    name: 'Serious Competitors',
    plan: 'Elite Plan',
    features: ['Everything in Growth', '2 monthly mentorship hours', 'Monthly film breakdown review', 'Quarterly parent feedback session'],
    highlight: false,
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: '#070e1a' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d1b2e 0%, #0a1628 45%, #061020 100%)' }}
      >
        {/* Left radial glow (content side) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 20% 50%, rgba(59,159,224,0.07) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Right radial glow (carousel side) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 80% at 78% 50%, rgba(59,159,224,0.10) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        {/* Subtle diagonal grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,159,224,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,159,224,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* Two-column layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 py-28 lg:py-0 lg:min-h-screen">

          {/* ── LEFT: Content ─────────────────────────────────────────── */}
          <div className="flex-1 max-w-xl w-full text-center lg:text-left">

            <div className="smz-hero-1 flex justify-center lg:justify-start">
              <Image
                src="/smz-logo.png"
                alt="The S.M.I.L.E. Zone"
                width={72}
                height={72}
                className="mb-7 drop-shadow-lg"
                priority
              />
            </div>

            <div className="smz-hero-2 flex justify-center lg:justify-start">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(59,159,224,0.10)',
                  color: '#9DD8F5',
                  border: '1px solid rgba(59,159,224,0.20)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B9FE0]" aria-hidden="true" />
                Systemized Mental Performance
              </div>
            </div>

            <div className="smz-hero-3">
              <h1
                className="font-bebas text-white leading-none mb-5"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 60px rgba(59,159,224,0.22)',
                }}
              >
                The S.M.I.L.E.<br />Zone
              </h1>
            </div>

            <div className="smz-hero-4">
              <p
                className="text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
                style={{ color: 'rgba(255,255,255,0.62)' }}
              >
                A mindset + performance platform to help athletes, parents, and coaches grow on and off the field.
                Created by MLB veteran{' '}
                <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Jay Jackson</strong>.
              </p>
            </div>

            <div className="smz-hero-5">
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
                <Link
                  href="/community"
                  className="px-7 py-3.5 rounded-full font-bold text-base transition-all duration-150 cursor-pointer smz-btn-glow"
                  style={{ background: '#3B9FE0', color: '#fff' }}
                >
                  Join the Community
                </Link>
                <Link
                  href="/assessment"
                  className="px-7 py-3.5 rounded-full font-bold text-base transition-all duration-150 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  Free Assessment →
                </Link>
              </div>

              {/* Stat bar */}
              <div className="flex items-center justify-center lg:justify-start gap-8">
                <div className="smz-stat-1 text-center lg:text-left">
                  <p className="font-bebas text-white" style={{ fontSize: '2rem', letterSpacing: '0.04em', lineHeight: 1 }}>17</p>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>Pro Seasons</p>
                </div>
                <div className="w-px h-8" style={{ background: 'rgba(59,159,224,0.22)' }} aria-hidden="true" />
                <div className="smz-stat-2 text-center lg:text-left">
                  <p className="font-bebas text-white" style={{ fontSize: '2rem', letterSpacing: '0.04em', lineHeight: 1 }}>48</p>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>Week Curriculum</p>
                </div>
                <div className="w-px h-8" style={{ background: 'rgba(59,159,224,0.22)' }} aria-hidden="true" />
                <div className="smz-stat-3 text-center lg:text-left">
                  <p className="font-bebas text-white" style={{ fontSize: '2rem', letterSpacing: '0.04em', lineHeight: 1 }}>5</p>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>Support Tiers</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Carousel ───────────────────────────────────────── */}
          <div className="flex-1 max-w-lg w-full flex flex-col items-center">
            {/* "Inside the Platform" label */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              Inside the Platform
            </p>
            <FeatureCarousel images={HERO_IMAGES} className="w-full" />
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 smz-scroll-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: 'rgba(59,159,224,0.45)' }}>
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Bridging the Gap ─────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: 'linear-gradient(180deg, #EEF3F8 0%, #EEF3F8 100%)', borderTop: '1px solid rgba(59,159,224,0.12)' }}>
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
              mindset + performance
            </p>
            <h2
              className="font-bebas"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', letterSpacing: '0.04em', color: '#0d1b2e' }}
            >
              Bridging the<br />Performance Gap
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_PROPS.map(({ title, body, icon }, i) => (
              <RevealOnScroll key={title} delay={i * 80} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
              <div
                className="p-6 rounded-2xl smz-card-hover h-full"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(59,159,224,0.18)',
                  boxShadow: '0 2px 12px rgba(13,27,46,0.06)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(59,159,224,0.10)', color: '#3B9FE0' }}
                >
                  {icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: '1rem', color: '#0d1b2e' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B6280' }}>{body}</p>
              </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Value statement */}
          <div
            className="mt-10 p-6 rounded-2xl text-center"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(59,159,224,0.22)',
              boxShadow: '0 2px 12px rgba(13,27,46,0.06)',
            }}
          >
            <p className="font-bold" style={{ color: '#1D5F8A', fontSize: '0.9375rem' }}>
              The S.M.I.L.E. Zone costs less than elite private coaching, delivers more than remote training,
              and creates outcomes drill programs cannot.
            </p>
            <p className="text-xs mt-1 uppercase tracking-widest font-bold" style={{ color: '#8FA8C0' }}>
              Maximum Impact, Smart Investment
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#070e1a' }}>
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
              The S.M.I.L.E. Zone
            </p>
            <h2
              className="font-bebas text-white"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', letterSpacing: '0.04em' }}
            >
              How It Works
            </h2>
          </RevealOnScroll>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

            {/* ── Left: step list ──────────────────────────────── */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col gap-0">
                {HOW_IT_WORKS.map(({ step, title, body }, i) => (
                  <RevealOnScroll key={step} delay={i * 60} direction="left">
                  <div className="flex gap-6 relative">
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div
                        className="absolute left-[19px] top-10 bottom-0 w-px"
                        style={{ background: 'rgba(59,159,224,0.15)' }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="shrink-0 relative z-10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-sm"
                        style={{
                          background: 'rgba(59,159,224,0.12)',
                          border: '1px solid rgba(59,159,224,0.25)',
                          color: '#9DD8F5',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {step}
                      </div>
                    </div>
                    <div className="pb-10">
                      <h3 className="font-bold text-white mb-1" style={{ fontSize: '1rem' }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
                    </div>
                  </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            {/* ── Right: 5 Dimensions orbital ──────────────────── */}
            <div className="w-full lg:w-1/2">
              <RevealOnScroll direction="right">
                <div className="text-center mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3B9FE0' }}>
                    Interactive
                  </p>
                  <h3
                    className="font-bebas text-white"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', letterSpacing: '0.04em' }}
                  >
                    The 5 Dimensions
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Tap any node to explore
                  </p>
                </div>
                <RadialOrbitalTimeline timelineData={DIMENSIONS} />
              </RevealOnScroll>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ───────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#F0F5FA', borderTop: '1px solid rgba(59,159,224,0.12)' }}>
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#3B9FE0' }}>
              Choose Your Level
            </p>
            <h2
              className="font-bebas"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', letterSpacing: '0.04em', color: '#0d1b2e' }}
            >
              Built for Every Athlete
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#4B6280' }}>
              From foundational habits to elite mentorship — pick the support level that fits.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
            {PRICING_TIERS.map(({ name, plan, features, highlight }, i) => (
              <RevealOnScroll key={name} delay={i * 80}>
              <div className="relative pt-4">
                {highlight && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{ background: '#3B9FE0', color: '#fff' }}
                  >
                    Most Popular
                  </div>
                )}
              <div
                className={`p-6 rounded-2xl flex flex-col smz-card-hover${highlight ? ' smz-card-shimmer' : ''}`}
                style={{
                  background: highlight
                    ? 'linear-gradient(160deg, #0d1b2e 0%, #162540 100%)'
                    : '#FFFFFF',
                  border: highlight
                    ? '1px solid rgba(59,159,224,0.35)'
                    : '1px solid rgba(59,159,224,0.15)',
                  boxShadow: highlight
                    ? '0 8px 32px rgba(13,27,46,0.18)'
                    : '0 2px 12px rgba(13,27,46,0.06)',
                }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: highlight ? '#9DD8F5' : '#3B9FE0' }}>{name}</p>
                <h3 className="font-bold mb-4" style={{ fontSize: '1.1rem', color: highlight ? '#FFFFFF' : '#0d1b2e' }}>{plan}</h3>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: highlight ? 'rgba(255,255,255,0.72)' : '#374151' }}>
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="rgba(16,185,129,0.4)" />
                        <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/community"
                  className="block text-center py-2.5 rounded-full text-sm font-bold cursor-pointer transition-opacity duration-150"
                  style={
                    highlight
                      ? { background: '#3B9FE0', color: '#fff' }
                      : { background: 'rgba(13,27,46,0.06)', color: '#0d1b2e', border: '1px solid rgba(13,27,46,0.14)' }
                  }
                >
                  See Plans
                </Link>
              </div>
              </div>
              </RevealOnScroll>
            ))}
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
            View all 5 tiers including M.V.P. and Locker Room on the{' '}
            <Link href="/community" style={{ color: '#3B9FE0' }}>Community page</Link>.
          </p>
        </div>
      </section>

      {/* ── Assessment CTA Banner ────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #0d1b2e 0%, #0a1628 50%, #061020 100%)',
          borderTop: '1px solid rgba(59,159,224,0.10)',
          borderBottom: '1px solid rgba(59,159,224,0.10)',
        }}
      >
        <RevealOnScroll className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9DD8F5' }}>
            Free · No Account Needed
          </p>
          <h2
            className="font-bebas text-white mb-4"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', letterSpacing: '0.04em' }}
          >
            Discover Your<br />Player Archetype
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Take the free S.M.I.L.E. Zone assessment. Get your Mental Mindset score,
            Baseball IQ score, and a personalized report from a pro coach.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base cursor-pointer"
            style={{ background: '#3B9FE0', color: '#fff', boxShadow: '0 4px 24px rgba(59,159,224,0.45)' }}
          >
            Start Free Assessment →
          </Link>
        </RevealOnScroll>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#070e1a' }}>
        <div className="max-w-xl mx-auto">
          <div className="mb-10 text-center">
            <h2
              className="font-bebas text-white"
              style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '0.04em' }}
            >
              Let&apos;s Talk
            </h2>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Questions about the program? Reach out directly.
            </p>
          </div>
          <ContactFormInline />
        </div>
      </section>

    </main>
  )
}

