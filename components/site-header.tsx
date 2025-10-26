'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Video, HelpCircle, Info, Home, Megaphone } from 'lucide-react'

export function SiteHeader() {
  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/About', label: 'About', icon: Info },
    { href: '/announcement', label: 'Announcement', icon: Megaphone },
    { href: '/faq', label: 'Help', icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/PSU-logo.svg"
              alt="PSU Rizal logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="font-bold tracking-wide text-white">
              COM | PSU Rizal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white">
              <Link href="/guest" className="inline-flex items-center gap-2">
                <Video className="h-5 w-5" />
                New Meeting
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <MobileSidebar links={links} />
          </div>
        </div>
      </div>
    </header>
  )
}

export function MobileSidebar({
  links,
}: {
  links: { href: string; label: string; icon: React.ComponentType<any> }[]
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
            alt="PSU Rizal logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-bold tracking-wide text-white text-lg">
            COM | PSU Rizal
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 mt-2 text-gray-200">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-900/50 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                <l.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{l.label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
