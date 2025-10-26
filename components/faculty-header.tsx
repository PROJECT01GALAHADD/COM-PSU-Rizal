'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Home,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Bell,
  User,
  LogOut,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface FacultyHeaderProps {}

export function FacultyHeader({}: FacultyHeaderProps) {
  const router = useRouter()
  const [demoRole, setDemoRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData)
        setDemoRole(demoUser?.role || null)
      }
    } catch {}
  }, [])

  const handleLogout = () => {
    // Implement your logout logic here
    try {
      localStorage.removeItem('com_demo_auth_v1')
      document.cookie = `demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    } catch {}
    router.push('/login')
  }

  const menuItems = [
    { href: '/faculty', label: 'Dashboard', icon: Home },
    { href: '/faculty/classes', label: 'My Classes', icon: BookOpen },
    { href: '/faculty/grading', label: 'Grade Management', icon: Award },
    { href: '/faculty/roster', label: 'Student Roster', icon: Users },
    { href: '/faculty/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/faculty/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/faculty/messages', label: 'Messages', icon: MessageSquare },
    { href: '/faculty/notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/faculty" className="flex items-center gap-2">
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
                className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-1"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {demoRole && (
              <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Demo Mode — {demoRole}
              </span>
            )}
            <Link
              href="/faculty/profile"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg px-5 py-2.5 shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
            <Button
              className="bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg px-5 py-2.5 shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40 hover:scale-[1.02] transition-all"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden">
            <MobileFacultyNav menuItems={menuItems} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileFacultyNav({
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
          className="border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800"
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
            Faculty Portal
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 mt-2 text-gray-200 flex-grow">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-900/50 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Action Buttons at Bottom */}
        <div className="mt-auto border-t border-gray-800 p-4 space-y-3">
          <Link
            href="/faculty/profile"
            className="inline-flex w-full items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg px-6 py-3 shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Button
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg px-6 py-3 shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40 transition-all"
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
