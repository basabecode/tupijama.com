import { redirect } from 'next/navigation'

export default function AdminIndexPage() {
  // Redirigir al listado principal del panel
  redirect('/admin/products')
}
