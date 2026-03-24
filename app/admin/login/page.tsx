import { redirect } from 'next/navigation'
import { getAdminFromCookies } from '@/lib/auth'
import AdminLoginClient from '@/components/admin/AdminLoginClient'

export default function AdminLoginPage() {
  const admin = getAdminFromCookies()
  if (admin) redirect('/admin')

  return <AdminLoginClient />
}
