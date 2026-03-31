import type { Metadata } from 'next'
import Image from 'next/image'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Meet the Team — The S.M.I.L.E. Zone',
  description:
    'Meet the MLB veterans and coaches behind The S.M.I.L.E. Zone. Led by Jay Jackson, our team of pro coaches helps athletes build confidence, discipline, and focus.',
}

const COACHES = [
  {
    name: 'Jay Jackson',
    role: 'Founder & Lead Coach',
    teams: 'Padres · Brewers · Giants · Braves · Blue Jays · Japan · Mexico',
    bio: 'Jay Jackson is a 17-year professional baseball veteran, former Major League pitcher, author, and international competitor whose journey spans MLB stadiums, global ballparks, and the hard-earned lessons of a career defined by perseverance and intentional growth. He founded The S.M.I.L.E. Zone to offer mentorship, mindset training, and a supportive system that helps young athletes thrive on and off the field. Jay is also the author of "9 Innings to Living Your Best Life," the foundation of the program\'s philosophy.',
    initials: 'JJ',
    color: '#3B9FE0',
    photo: '/coaches/jay-jackson.jpg',
  },
  {
    name: 'Trayvon Robinson',
    role: 'Coach',
    teams: 'Los Angeles Dodgers · Baltimore Orioles',
    bio: 'Trayvon Robinson is a former Major League outfielder with professional experience in the Dodgers and Orioles organizations. His career was built on perseverance, discipline, and continuous development. As a coach, Trayvon focuses on helping athletes strengthen both their physical skills and mental toughness, emphasizing accountability, hard work, and intentional effort.',
    initials: 'TR',
    color: '#8B5CF6',
    photo: '/coaches/trayvon-robinson1.jpg',
    photoFit: 'contain' as const,
  },
  {
    name: 'Jaylin Davis',
    role: 'Coach',
    teams: 'San Francisco Giants · Minnesota Twins',
    bio: 'Jaylin Davis is a former Major League outfielder who played for the Giants and Twins. Known for his power, athleticism, and calm approach, Jaylin understands the importance of preparation and consistency at the professional level. As a coach, he helps athletes build strong routines, confidence, and a reliable game-day mindset.',
    initials: 'JD',
    color: '#10b981',
    photo: '/coaches/jaylin-davis.jpg',
  },
  {
    name: 'Edgar Olmos',
    role: 'Coach',
    teams: 'MLB & International Competition',
    bio: 'Edgar Olmos is a former Major League Baseball pitcher with experience in MLB organizations and extensive international competition. His career reflects resilience, adaptability, and the ability to grow through challenging environments. As a coach, Edgar brings a global perspective to player development, blending pitching fundamentals with mental strength and intentional routines.',
    initials: 'EO',
    color: '#f59e0b',
    photo: '/coaches/edgar-olmos.jpg',
  },
  {
    name: 'Keyvius Sampson',
    role: 'Coach',
    teams: 'Cincinnati Reds · International',
    bio: 'Keyvius Sampson is a former Major League pitcher for the Cincinnati Reds with additional international playing experience. Known for his explosive arm and composed presence on the mound, Keyvius understands what it takes to perform under pressure. In his coaching role, he focuses on pitching mechanics, mental toughness, and purpose-driven preparation.',
    initials: 'KS',
    color: '#ef4444',
    photo: '/coaches/keyvius-sampson.jpg',
  },
  {
    name: 'Taylor Motter',
    role: 'College Placement Coach',
    teams: 'Tampa Bay Rays · Seattle Mariners · St. Louis Cardinals · Colorado Rockies',
    bio: 'Taylor Motter is a former MLB player who played every position on the field except pitcher and catcher for four different organizations. Known for his versatility, Taylor brings deep knowledge of the game and a passion for developing confident, focused athletes ready for the next level.',
    initials: 'TM',
    color: '#06b6d4',
    photo: '/coaches/taylor-motter.png',
  },
]

export default function TeamPage() {
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
          Who&apos;s Who
        </p>
        <h1
          className="font-bebas text-white"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', letterSpacing: '0.04em' }}
        >
          Meet the Team
        </h1>
        <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Every coach on our staff has played professionally. They know the game — and they know what it takes mentally.
        </p>
      </section>

      {/* Coach grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {COACHES.map(({ name, role, teams, bio, initials, color, photo, photoFit }, i) => (
            <RevealOnScroll key={name} delay={i * 60} direction={i % 2 === 0 ? 'left' : 'right'}>
            <div
              className="rounded-2xl overflow-hidden flex flex-col smz-card-hover"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Photo */}
              <div
                className="relative w-full"
                style={{
                  height: photoFit === 'contain' ? '360px' : '260px',
                  background: photoFit === 'contain' ? '#0a1220' : undefined,
                }}
              >
                <Image
                  src={photo}
                  alt={`${name} — ${role}`}
                  fill
                  className={photoFit === 'contain' ? 'object-contain' : 'object-cover object-top'}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* gradient overlay at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-20"
                  style={{ background: 'linear-gradient(to top, rgba(7,14,26,0.85) 0%, transparent 100%)' }}
                />
              </div>

              <div className="p-6 flex flex-col gap-3">
                {/* Name + role */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-sm shrink-0"
                    style={{ background: `${color}22`, color, border: `1.5px solid ${color}44`, letterSpacing: '0.05em' }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div>
                    <h2 className="font-bold text-white" style={{ fontSize: '1.05rem' }}>{name}</h2>
                    <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color }}>
                      {role}
                    </p>
                  </div>
                </div>

                {/* Teams */}
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {teams}
                </p>

                {/* Bio */}
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {bio}
                </p>
              </div>
            </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

    </main>
  )
}
