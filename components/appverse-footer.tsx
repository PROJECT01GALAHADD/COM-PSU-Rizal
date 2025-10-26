'use client'

import Link from 'next/link'
import Image from 'next/image'

export function AppverseFooter() {
  const footerContent = {
    tagline:
      'Empowering seamless, high-quality virtual interaction for Palawan State University (PSU) Rizal.',
    copyright: `© ${new Date().getFullYear()} — Palawan State University Rizal`,
  }

  const footerLinks = [
    { href: 'https://psu.palawan.edu.ph/', label: 'University Home' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/acceptable-use', label: 'Acceptable Use' },
  ]

  return (
    <section className="text-white">
      <footer className="border-t border-white/10 pb-10 pt-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/icons/PSU-logo.svg"
                  alt="PSU Rizal logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                  PSU Rizal Campus
                </span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">
                {footerContent.tagline}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Resources
              </h5>
              <ul className="space-y-2 text-sm text-neutral-300">
                {footerLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-orange-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{footerContent.copyright}</p>
            <div className="flex items-center gap-6">
              {/* Add any other bottom links here if needed */}
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
