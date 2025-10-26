'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Home,
  GraduationCap,
  Users,
  FileText,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'

export function AdminHeader() {
  const handleLogout = () => {
    try {
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie =
        'admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } catch (error) {
      console.error('Error clearing cookies:', error)
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/students', label: 'Students', icon: GraduationCap },
    { href: '/admin/faculty', label: 'Faculty', icon: Users },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/curriculum', label: 'Curriculum', icon: FileText },
    { href: '/admin/announcements', label: 'Announcements', icon: FileText },
    { href: '/admin/resources', label: 'Resources', icon: FileText },
    { href: '/admin/manage', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/icons/PSU-logo.svg"
              alt="PSU logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="font-bold tracking-wide text-white">
              COM | PSU Rizal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 text-xs lg:flex">
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1 text-white hover:text-white transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg px-4 py-2 shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 transition-colors"
            >
              <Link href="/admin/manage">Admin Console</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg px-4 py-2 shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden">
            <MobileAdminNav menuItems={menuItems} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileAdminNav({
  menuItems,
  onLogout,
}: {
  menuItems: { href: string; label: string; icon: React.ComponentType<any> }[]
  onLogout: () => void
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-700 bg-gray-900/80 text-white hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="liquid-glass border-gray-800 p-0 w-72 flex flex-col"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-800">
          <Image
            src="/icons/PSU-logo.svg"
            alt="PSU logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-bold tracking-wide text-white text-lg">
            Admin Portal
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 mt-2 text-white flex-grow">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-900/50 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 text-white">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Action Buttons at Bottom */}
        <div className="mt-auto border-t border-gray-800 p-4 space-y-3">
          <Link
            href="/admin/manage"
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg px-5 py-2.5 shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 transition-colors text-sm"
          >
            Admin Console
          </Link>
          <Button
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg px-5 py-2.5 shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40 transition-colors text-sm"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
