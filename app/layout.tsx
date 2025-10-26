import type React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import PlasmaRouteGuard from '@/components/plasma-route-guard'
import ClientOnly from '@/components/ui/ClientOnly'
import { Toaster } from '@/components/ui/toaster'
import { ProfileProvider } from '@/components/profile-context'
import { DemoModeProvider } from '@/components/demo-mode-context'
import { DemoModeToggle } from '@/components/demo-mode-toggle'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'PSU Rizal | Academic Collaboration Platform',
  description:
    'A unified platform for Palawan State University (PSU) Rizal, enabling seamless virtual interaction, academic management, and collaboration for students and faculty.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preload" href="/images/com-background-3.jpg" as="image" />
        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-black bg-com-landing">
          <ClientOnly>
            <PlasmaRouteGuard
              color="#f97316"
              speed={0.6}
              direction="forward"
              scale={1.5}
              opacity={0.35}
              mouseInteractive={false}
            />
          </ClientOnly>
        </div>
        <DemoModeProvider>
          <ProfileProvider>
            <div className="relative z-10">{children}</div>
            <div className="fixed bottom-4 right-4 flex gap-2">
              <ClientOnly>
                <DemoModeToggle />
              </ClientOnly>
            </div>
          </ProfileProvider>
        </DemoModeProvider>
        <Toaster />
      </body>
    </html>
  )
}
