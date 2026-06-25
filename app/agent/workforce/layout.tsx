import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export const metadata = {
  title: 'Workforce | ThreadFlow AI',
}

export default function WorkforceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <Sidebar />
      <main className="ml-64 pt-20">
        {children}
      </main>
    </div>
  )
}