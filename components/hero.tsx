'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Video, Users, Share2, Shield } from 'lucide-react'
import Animated from './ui/Animated'
import { RegistrationModal } from '@/components/auth/registration-modal'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image
              src="/icons/PSU-logo.svg"
              alt="PSU logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <p className="text-sm uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
              COM | PALAWAN STATE UNIVERSITY
            </p>
          </div>
          <Animated className="w-full">
            <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">STAY CONNECTED,</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.35)]">
                LEARN ANYWHERE
              </span>
            </h1>
          </Animated>
          <p className="mt-4 text-center text-lg text-white/90 max-w-3xl">
            Collaboration Online Meet (COM) is a reliable video conferencing and
            academic collaboration platform designed for students and
            instructors. It ensures continuous learning even during challenges
            like resource shortages or global disruptions.
          </p>
          <p className="mt-3 text-center text-lg text-white/90 max-w-3xl">
            With COM, you can easily attend classes, collaborate on projects,
            submit files securely with automatic backup, and track attendance
            and grades in real time. Whether you&apos;re a part-time student, a
            working parent, or someone who prefers virtual interaction—COM helps
            you stay engaged, informed, and connected.
          </p>
          <Animated
            className="mt-6 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
            >
              <a href="/guest" rel="noopener noreferrer">
                Join Meeting
              </a>
            </Button>
            {/* Replace link-based Register with modal trigger */}
            <RegistrationModal />
          </Animated>

          {/* Feature Cards Grid */}
          <div className="mt-16 grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl">
            {featureCards.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            ))}
          </div>

          {/* Showcase Images */}
          <div className="mt-16 grid w-full gap-6 md:grid-cols-2 max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/psu-1.jpg"
                alt="Palawan State University"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Intuitive Interface
                </h3>
                <p className="text-white/90">
                  Easy to use and navigate for all users
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/psu-2.jpg"
                alt="PSU Rizal Campus Community"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Top Rated Platform
                </h3>
                <p className="text-white/90">Trusted by students and faculty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: any
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="relative group">
      <div className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>
    </div>
  )
}

const featureCards = [
  {
    icon: Video,
    title: 'Group Calls',
    description: 'High-quality video meetings.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Real-time document editing.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Share2,
    title: 'Screen Share',
    description: 'Share your screen with ease.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Robust security features.',
    gradient: 'from-purple-500 to-pink-500',
  },
]
