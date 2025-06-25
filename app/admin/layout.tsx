import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen, LogOut } from "lucide-react"
import { checkRole } from '@/lib/role'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Kiểm tra quyền admin
  const isAdmin = await checkRole('admin')
  if (!isAdmin) {
    redirect('/dashboard')
  }
  // Lấy thông tin user
  const user = await currentUser()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/tests', label: 'Test Management', icon: BookOpen },
    { href: '/admin/questions', label: 'Question Management', icon: BookOpen },
    { href: '/admin/users', label: 'User Management', icon: Users },
  ]

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='border-b-8 border-black bg-primary p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/admin'>
            <h1 className='text-3xl font-black text-white uppercase'>
              Admin Dashboard
            </h1>
          </Link>
          <div className='flex items-center gap-4'>
            <span className='text-white font-bold'>
              Admin: {user?.firstName}
            </span>
            <Button
              asChild
              className='brutalist-button bg-white text-primary'>
              <Link href='/dashboard'>
                <LogOut className='mr-2 h-4 w-4' /> Back to App
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className='flex flex-1'>
        {/* Sidebar */}
        <aside className='w-64 border-r-8 border-black bg-white'>
          <nav className='p-4'>
            <ul className='space-y-2'>
              {menuItems.map((item) => {
                // Không có usePathname phía server, nên active state cần xử lý khác nếu muốn
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-menu-item`}>
                      <item.icon className='mr-2 h-5 w-5' />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className='flex-1 p-6 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
} 