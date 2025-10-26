"use client"

import Image from "next/image"
import { Video, Users, Shield, Calendar, MessageSquare, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Video,
      title: "HD Video Conferencing",
      description: "Crystal-clear video and audio quality for virtual classes and meetings with up to 50 participants.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Screen sharing, breakout rooms, and interactive tools to enhance group discussions and presentations.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption and role-based access control to protect your academic data and privacy.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Schedule & Organize",
      description: "Manage classes, office hours, and academic events with integrated calendar and notifications.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "In-meeting chat, file sharing, and persistent messaging for continuous collaboration.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FileText,
      title: "Academic Management",
      description: "Track assignments, submissions, grades, and course materials all in one place.",
      gradient: "from-indigo-500 to-blue-500"
    }
  ]

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
          Everything you need for online learning
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Built specifically for academic collaboration at PSU Rizal, combining video conferencing with comprehensive learning tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card 
              key={index} 
              className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Video Demo Section */}
      <div className="mt-20">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">See it in action</h3>
          <p className="text-white/90">Experience seamless collaboration designed for PSU Rizal</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Video className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Virtual Classroom Demo</p>
                </div>
              </div>
            </div>
            <CardContent className="pt-4">
              <h4 className="text-lg font-semibold text-white mb-2">Virtual Classrooms</h4>
              <p className="text-sm text-white/90">Host interactive online classes with screen sharing, whiteboard, and breakout rooms.</p>
            </CardContent>
          </Card>

          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Users className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Group Collaboration Demo</p>
                </div>
              </div>
            </div>
            <CardContent className="pt-4">
              <h4 className="text-lg font-semibold text-white mb-2">Study Groups</h4>
              <p className="text-sm text-white/90">Students can create and join study groups for collaborative learning and peer support.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
