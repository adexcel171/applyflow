import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | ApplyFlow',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50 font-body">
      {children}
    </div>
  )
}
