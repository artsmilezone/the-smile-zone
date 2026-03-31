import type { Metadata } from 'next'
import Link from 'next/link'
import RevealOnScroll from '@/components/RevealOnScroll'
import FaqAccordion from '@/components/FaqAccordion'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import PricingTiersSection from '@/components/PricingTiersSection'

export const metadata: Metadata = {
  title: 'Community — The S.M.I.L.E. Zone',
  description:
    'Join The S.M.I.L.E. Zone community. Choose from 5 membership tiers — from foundational curriculum to elite mentorship with monthly coach calls and film review.',
}

const COMMUNITY_URL = 'https://the-smile-zone.mn.co'

const WHO_FOR = [
  {
    label: 'Parents',
    body: 'You want structure and coaching that helps your athlete handle pressure and adversity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      </svg>
    ),
  },
  {
    label: 'Players',
    body: 'Build routines and mental reps that translate to performance when it matters most.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: '18+ Athletes',
    body: 'Own your process with a weekly system for mindset and self-evaluation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" />
      </svg>
    ),
  },
]

const TESTIMONIALS = [
  {
    quote: 'Really enjoyed the content. Every video was clear and concise. I really enjoyed spending time on the app!',
    name: 'Bo Lowrance',
    designation: 'Platform Member',
    src: '/coaches/bo-lowrance.jpg',
  },
  {
    quote: 'Getting to work with Jay this summer was a blessing. The conversations we had led us to winning the league and me winning most valuable pitcher. The main thing I enjoyed was the mental side of the game — the separator at higher levels is the mindset.',
    name: 'Cameron LeJeune',
    designation: 'MVP Pitcher · Platform Member',
    src: '/coaches/cameron-lejeune.jpg',
  },
  {
    quote: "Great sports app overall. It's easy to use. Especially useful for coaches and players — a really great tool for staying informed and prepared.",
    name: 'Nick Lawrence',
    designation: 'Coach & Platform Member',
    src: '/coaches/nick-lawrence.jpg',
  },
]

const FAQS = [
  {
    q: 'Is this for parents or players?',
    a: 'Both. Parents get structure to support development; serious 18+ players can join and own the process directly.',
  },
  {
    q: 'Is this baseball mechanics training?',
    a: 'No — this focuses on mindset, confidence, leadership habits, accountability, and performance composure.',
  },
  {
    q: 'Where do I see pricing and billing options?',
    a: 'Full pricing details are shown on the membership page after you click "Join Community."',
  },
]

export default function CommunityPage() {
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
          Start Making Intentional Life Efforts
        </p>
        <h1
          className="font-bebas text-white mb-4"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', letterSpacing: '0.04em' }}
        >
          Join the Community
        </h1>
        <p className="text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
          A mindset + performance community built for baseball players, guided by pro coaches and a 48-week curriculum.
        </p>
        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-7 py-3.5 rounded-full font-bold text-base cursor-pointer"
          style={{ background: '#3B9FE0', color: '#fff', boxShadow: '0 4px 20px rgba(59,159,224,0.4)', transition: 'background 0.15s ease, box-shadow 0.15s ease' }}
        >
          Join or Login Community
        </a>
      </section>

      {/* Who this is for */}
      <section className="py-16 px-4" style={{ background: '#EEF3F8', borderTop: '1px solid rgba(59,159,224,0.12)' }}>
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <p className="text-xs font-bold uppercase tracking-widest mb-8 text-center" style={{ color: '#8FA8C0' }}>
              Who This Community Is For
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHO_FOR.map(({ label, body, icon }, i) => (
              <RevealOnScroll key={label} delay={i * 80}>
              <div
                className="p-5 rounded-2xl flex flex-col gap-3 smz-card-hover"
                style={{ background: '#FFFFFF', border: '1px solid rgba(59,159,224,0.18)', boxShadow: '0 2px 12px rgba(13,27,46,0.06)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,159,224,0.10)', color: '#3B9FE0' }}
                >
                  {icon}
                </div>
                <h3 className="font-bold" style={{ color: '#0d1b2e' }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B6280' }}>{body}</p>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-16 px-4" style={{ background: '#070e1a' }}>
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll>
            <h2
              className="font-bebas text-white text-center mb-8"
              style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '0.04em' }}
            >
              What&apos;s Inside
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,159,224,0.12)' }}
          >
            {[
              'S.M.I.L.E. Zone 48-week curriculum (confidence, composure, leadership habits)',
              'Weekly accountability structure (assignments + follow-through)',
              'Coaching touchpoints that scale with your plan (calls, notes, film)',
              'A community built around intentional effort — not hype',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="rgba(16,185,129,0.35)" />
                  <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</p>
              </div>
            ))}
          </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Pricing tiers */}
      <PricingTiersSection />

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 overflow-hidden" style={{ background: '#070e1a' }}>
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#3B9FE0' }}>
              Real Results
            </p>
            <h2
              className="font-bebas text-white text-center mb-14"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '0.04em' }}
            >
              What They&apos;re Saying
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="scale">
            <AnimatedTestimonials testimonials={TESTIMONIALS} />
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4" style={{ background: '#EEF3F8', borderTop: '1px solid rgba(59,159,224,0.12)' }}>
        <div className="max-w-2xl mx-auto">
          <RevealOnScroll>
            <h2
              className="font-bebas text-center mb-10"
              style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '0.04em', color: '#0d1b2e' }}
            >
              FAQ
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <FaqAccordion items={FAQS} light />
          </RevealOnScroll>

          <div className="mt-10 text-center">
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3.5 rounded-full font-bold text-base cursor-pointer"
              style={{ background: '#3B9FE0', color: '#fff', boxShadow: '0 4px 20px rgba(59,159,224,0.4)', transition: 'background 0.15s ease, box-shadow 0.15s ease' }}
            >
              Join or Login Community
            </a>
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section
        className="py-16 px-4 text-center"
        style={{ borderTop: '1px solid rgba(59,159,224,0.10)' }}
      >
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Not sure where you stand? Start here — it&apos;s free.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center px-7 py-3 rounded-full font-bold text-sm cursor-pointer"
          style={{ background: 'rgba(59,159,224,0.12)', color: '#9DD8F5', border: '1px solid rgba(59,159,224,0.25)' }}
        >
          Take the Free Assessment →
        </Link>
      </section>

    </main>
  )
}
