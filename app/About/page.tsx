import React from 'react'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, Target, Eye, Flag, Heart, CheckCircle2, Users, GraduationCap, UserCog, Settings, Monitor, Code, Database, Cloud, Zap } from 'lucide-react'

export default function AboutPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'About | COM PSU Rizal Academic Collaboration Platform',
    description:
      'Learn about Collaboration Online Meet (COM), a unified platform for Palawan State University Rizal enabling seamless virtual interaction, meetings, and academic workflows.',
    url: 'https://psu-rizal.local/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Palawan State University - Rizal Campus',
    },
  } as const

  const coreValues = [
    { letter: 'E', value: 'Excellence in service' },
    { letter: 'Q', value: 'Quality Assurance' },
    { letter: 'U', value: 'Unity in diversity' },
    { letter: 'A', value: 'Advocacy for sustainable development' },
    { letter: 'L', value: 'Leadership by example' },
    { letter: 'I', value: 'Innovative by example' },
    { letter: 'T', value: 'Transparency' },
    { letter: 'Y', value: 'Youth empowerment' },
  ]

  return (
    <>
      {/* Structured data for search/LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

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

        {/* Hero Section */}
        <section className="relative isolate overflow-hidden">
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5 flex items-center gap-2">
                <Image src="/icons/PSU-logo.svg" alt="PSU logo" width={32} height={32} className="h-8 w-8" />
                <p className="text-sm uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">COM | PALAWAN STATE UNIVERSITY</p>
              </div>
              <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">ABOUT</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.35)]">COM PLATFORM</span>
              </h1>
              <div className="mt-8 max-w-4xl">
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-lg text-white/90 leading-relaxed">
                      Collaboration Online Meet (COM) is an innovative video conferencing and academic collaboration platform that ensures continuous learning despite challenges such as pandemics, limited resources, or schedule conflicts. It provides students and instructors with accessible tools for online communication, file backup, attendance tracking, and grade monitoring.
                    </p>
                    <p className="text-lg text-white/90 leading-relaxed mt-4">
                      COM supports flexible learning for part-time students, parents, and individuals who prefer virtual interaction—promoting inclusivity, efficiency, and academic continuity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Highlights Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                Key Highlights
              </h2>
              <p className="text-lg text-white/70">Production-ready features and capabilities</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Production Ready</h3>
                  <p className="text-white/70 text-sm">Fully tested and deployment-ready with autoscale configuration</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Video className="w-8 h-8 text-orange-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Enterprise Video</h3>
                  <p className="text-white/70 text-sm">Twilio Video integration for HD conferencing (up to 50 participants)</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Guest Access</h3>
                  <p className="text-white/70 text-sm">No account required for joining meetings</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <GraduationCap className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Academic Management</h3>
                  <p className="text-white/70 text-sm">Complete curriculum system with 4 programs and 164 subjects</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Settings className="w-8 h-8 text-cyan-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Secure Authentication</h3>
                  <p className="text-white/70 text-sm">JWT-based with role-based access control and admin approval</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Monitor className="w-8 h-8 text-pink-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Responsive Design</h3>
                  <p className="text-white/70 text-sm">Beautiful glass morphism UI that works on all devices</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Code className="w-8 h-8 text-yellow-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Modern Stack</h3>
                  <p className="text-white/70 text-sm">Next.js 14, React 18, TypeScript, Tailwind CSS 4, PostgreSQL</p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <Cloud className="w-8 h-8 text-indigo-500 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Multi-Platform</h3>
                  <p className="text-white/70 text-sm">Deploys to Replit (autoscale), Vercel, or Firebase</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features for Users Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                Platform Features
              </h2>
              <p className="text-lg text-white/70">Comprehensive tools for every user type</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* For Students */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-white/80 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>View enrolled courses and progress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Submit assignments and track grades</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access class schedules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Download course materials and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Receive notifications and announcements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Join video classes instantly</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* For Faculty */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">For Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-white/80 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Manage multiple classes and sections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Track student attendance and performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Grade assignments and provide feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Post announcements to students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Upload teaching materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Conduct live video lectures</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* For Administrators */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <UserCog className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">For Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-white/80 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Content management system (CMS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Pricing and subscription management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Analytics and reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Platform settings and configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>User approval and management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>System monitoring and maintenance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Conferencing Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-white">Video Conferencing (Twilio Video)</CardTitle>
                </div>
                <p className="text-white/70">Enterprise-grade video conferencing powered by Twilio</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Enterprise-grade HD video</p>
                      <p className="text-white/60 text-xs">Powered by Twilio Video SDK</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Professional controls</p>
                      <p className="text-white/60 text-xs">Mute/unmute, camera on/off</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Screen sharing</p>
                      <p className="text-white/60 text-xs">Built-in screen share capability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Real-time chat</p>
                      <p className="text-white/60 text-xs">In-meeting chat with WebSocket</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Up to 50 participants</p>
                      <p className="text-white/60 text-xs">Scalable SFU architecture</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Guest access</p>
                      <p className="text-white/60 text-xs">Join without account via link</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Recording ready</p>
                      <p className="text-white/60 text-xs">Infrastructure for recordings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cloud className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Global reliability</p>
                      <p className="text-white/60 text-xs">Twilio&apos;s enterprise infrastructure</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                Technology Stack
              </h2>
              <p className="text-lg text-white/70">Built with modern, production-ready technologies</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Frontend */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-white/70 text-xs">
                    <li>• Next.js 14.2.4 (App Router)</li>
                    <li>• React 18.2.0</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS 4.1.9</li>
                    <li>• Radix UI primitives</li>
                    <li>• Lucide React icons</li>
                    <li>• React Hook Form + Zod</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Backend & Database */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">Backend & Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-white/70 text-xs">
                    <li>• Drizzle ORM</li>
                    <li>• PostgreSQL (Replit/Neon)</li>
                    <li>• JWT with jose library</li>
                    <li>• bcryptjs hashing</li>
                    <li>• Next.js API routes</li>
                    <li>• Role-based middleware</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Real-time & Video */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">Real-time & Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-white/70 text-xs">
                    <li>• Twilio Video (Enterprise SFU)</li>
                    <li>• twilio-video SDK 2.x</li>
                    <li>• WebSocket chat</li>
                    <li>• React Hooks + TanStack Query</li>
                    <li>• Replit Object Storage</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Deployment */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                    <Cloud className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">Deployment & DevOps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-white/70 text-xs">
                    <li>• Replit (autoscale)</li>
                    <li>• Vercel / Firebase ready</li>
                    <li>• Node.js 20+</li>
                    <li>• pnpm package manager</li>
                    <li>• Next.js compiler</li>
                    <li>• @vercel/flags feature toggles</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {/* Mission */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  The Palawan State University is committed to upgrade people&apos;s quality of life by providing education opportunities through excellent, instruction, research extension, production services, and transnational collaboration.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  An internationally recognized university that provides relevant and innovative education and research for lifelong learning and sustainable development.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Goal and Objectives */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Goal and Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  To be a research-oriented science, technology, and entrepreneurship campus that focuses on innovations to contribute to human capital and community resource development of Rizal Municipality.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-orange-500" />
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Core Values
                </h2>
              </div>
              <p className="text-lg text-white/90">EQUALITY</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((item, index) => (
                <Card 
                  key={index}
                  className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.letter}</span>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed pt-2">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Copyright Section */}
        <section className="container mx-auto px-4 py-8 pb-16">
          <div className="text-center">
            <p className="text-white/90 text-sm">
              Copyright ©2025 All rights reserved.
            </p>
          </div>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
