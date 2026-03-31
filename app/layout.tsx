import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The S.M.I.L.E. Zone — Mindset + Performance for Baseball Athletes',
  description:
    'Built by MLB veteran Jay Jackson. Mental performance training, accountability, and a free baseball archetype assessment for athletes, parents, and coaches.',
  openGraph: {
    title: 'The S.M.I.L.E. Zone',
    description: 'Mindset + performance platform for baseball athletes.',
    url: 'https://www.the-smile-zone.com',
    siteName: 'The S.M.I.L.E. Zone',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bebasNeue.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  )
}
