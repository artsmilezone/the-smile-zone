import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div style={{ paddingTop: '64px' }}>{children}</div>
      <SiteFooter />
    </>
  )
}
