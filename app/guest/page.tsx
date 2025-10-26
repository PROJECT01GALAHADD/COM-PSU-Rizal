'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Video, Users, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function GuestAccessPage() {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateMeeting = () => {
    if (!meetingTitle.trim() || !participantName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide meeting title and your name',
        variant: 'destructive',
      })
      return
    }

    // Generate a random meeting ID
    const newMeetingId = Math.random().toString(36).substring(2, 10)

    toast({
      title: 'Meeting Created',
      description: `Meeting ID: ${newMeetingId}`,
    })

    // Redirect to the meeting page
    router.push(
      `/meetings/${newMeetingId}?host=true&name=${encodeURIComponent(participantName)}&guest=true`
    )
  }

  const handleJoinMeeting = () => {
    if (!meetingId.trim() || !participantName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide meeting ID and your name',
        variant: 'destructive',
      })
      return
    }

    router.push(
      `/meetings/${meetingId}?name=${encodeURIComponent(participantName)}&guest=true`
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-com-landing opacity-10 transform rotate-180" />

      <div className="container mx-auto max-w-5xl py-8 relative z-10">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join or Start a Meeting
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with classmates and faculty instantly. No account required
            for guest access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Meeting */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border-orange-500/20 border-2 shadow-xl shadow-orange-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Video className="w-6 h-6 text-orange-400" />
                </div>
                <span>Start a Meeting</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create an instant meeting and invite others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Meeting Title
                </label>
                <Input
                  placeholder="e.g., Team Discussion"
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  className="bg-white/10 border-white/30 border-2 text-white placeholder:text-white/50 h-12 text-base focus:border-orange-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Your Name
                </label>
                <Input
                  placeholder="e.g., Juan Dela Cruz"
                  value={participantName}
                  onChange={e => setParticipantName(e.target.value)}
                  className="bg-white/10 border-white/30 border-2 text-white placeholder:text-white/50 h-12 text-base focus:border-orange-500/50 transition-colors"
                />
              </div>
              <Button
                onClick={handleCreateMeeting}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-400 hover:to-orange-300 hover:scale-[1.02] transition-all"
              >
                <Video className="w-5 h-5 mr-2" />
                Create Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Join Meeting */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border-blue-500/20 border-2 shadow-xl shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span>Join a Meeting</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter a meeting ID to join instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Meeting ID
                </label>
                <Input
                  placeholder="e.g., abc123xyz"
                  value={meetingId}
                  onChange={e => setMeetingId(e.target.value)}
                  className="bg-white/10 border-white/30 border-2 text-white placeholder:text-white/50 h-12 text-base focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Your Name
                </label>
                <Input
                  placeholder="e.g., Maria Santos"
                  value={participantName}
                  onChange={e => setParticipantName(e.target.value)}
                  className="bg-white/10 border-white/30 border-2 text-white placeholder:text-white/50 h-12 text-base focus:border-blue-500/50 transition-colors"
                />
              </div>
              <Button
                onClick={handleJoinMeeting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:from-blue-500 hover:to-blue-400 hover:scale-[1.02] transition-all"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Need an account?{' '}
            <Button
              variant="link"
              className="text-orange-400 hover:text-orange-300 p-0 h-auto font-semibold"
              onClick={() => router.push('/signup')}
            >
              Sign up here
            </Button>
          </p>
          <p className="text-gray-600 text-xs">
            By using this service, you agree to our{' '}
            <a
              href="/acceptable-use"
              className="text-gray-500 hover:text-gray-400 underline"
            >
              Acceptable Use Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
