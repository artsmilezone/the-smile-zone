import Image from 'next/image'
import Assessment from '@/components/Assessment'

const TAGS = ['48-Week Program', '4 Phases', 'Mental Performance']

export const metadata = {
  title: 'Baseball Archetype Assessment — The S.M.I.L.E. Zone',
  description:
    'Discover your baseball player archetype and get a personalized mental performance report.',
}

export default function AssessmentPage() {
  return (
    <main className="min-h-screen py-10 px-4 smz-assessment-bg">
      <div className="max-w-xl mx-auto">

        {/* Hero */}
        <header className="text-center mb-8 smz-fade-in">
          <Image
            src="/smz-logo.png"
            alt="The S.M.I.L.E. Zone"
            width={110}
            height={110}
            className="mx-auto mb-4 drop-shadow-lg"
            priority
          />
          <h1
            className="font-bebas leading-none text-white mb-3"
            style={{ fontSize: 'clamp(2.75rem, 10vw, 4.25rem)', letterSpacing: '0.06em' }}
          >
            Discover Your<br />Player Archetype
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="text-[0.6875rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(59,159,224,0.12)',
                  color: '#9DD8F5',
                  border: '1px solid rgba(59,159,224,0.22)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <Assessment />

      </div>
    </main>
  )
}
