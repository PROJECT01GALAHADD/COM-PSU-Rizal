import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { AppverseFooter } from '@/components/appverse-footer'
import Script from 'next/script'

// Force static generation for low TTFB
export const dynamic = 'force-static'

export default function Page() {
  // Structured data for PSU Rizal Collaboration Platform
  const pageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PSU Rizal Collaboration Platform | Academic Video Conferencing & Learning',
    description:
      'A unified platform for Palawan State University - Rizal Campus students and faculty to connect, learn, and manage academic workflows with video conferencing, screen sharing, and collaboration tools.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://psu-rizal.edu.ph',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Palawan State University - Rizal Campus',
      url: 'https://psu.palawan.edu.ph',
      sameAs: [
        'https://www.facebook.com/PSURizal',
      ],
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : 'https://psu-rizal.edu.ph/login',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      },
      name: 'Sign In to PSU Rizal Platform'
    }
  }

  return (
    <>
      <main className="relative min-h-[100dvh] text-white overflow-hidden">
        {/* Background Image with Rotation */}
        <div 
          className="fixed inset-0 -z-10 w-full h-full"
          style={{
            backgroundImage: 'url(/images/com-background-3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'rotate(180deg)',
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="fixed inset-0 -z-10 bg-black/40" />
        
        <SiteHeader />
        <Hero />
        <Features />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
