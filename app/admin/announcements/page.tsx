'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Megaphone, Plus, Pin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  courseId: string | null
  priority: string
  isPinned: boolean
  createdAt: string
}

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal')
  const [isPinned, setIsPinned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Check admin authentication
    try {
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData)
        if (demoUser.role === 'admin') {
          setUser(demoUser)
          fetchAnnouncements()
          return
        }
      }

      const userStr = sessionStorage.getItem('user')
      if (!userStr) {
        router.push('/login')
        return
      }
      const userData = JSON.parse(userStr)
      if (userData.role !== 'admin') {
        router.push('/login')
        return
      }
      setUser(userData)
      fetchAnnouncements()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }, [router])

  async function fetchAnnouncements() {
    try {
      const response = await fetch('/api/announcements?campusWide=true')
      if (!response.ok) {
        throw new Error('Failed to fetch announcements')
      }
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error: any) {
      setError(error.message || 'Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    if (!user || !user.id) {
      setError('User not authenticated')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorId: user.id,
          courseId: null, // Campus-wide announcement
          priority,
          isPinned,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create announcement')
      }

      const data = await response.json()
      setAnnouncements([data.announcement, ...announcements])
      setTitle('')
      setContent('')
      setPriority('normal')
      setIsPinned(false)
      setSuccess('Announcement posted successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to create announcement')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-8 h-8" />
          Announcements Management
        </h1>
        <p className="text-white/70 mt-2">
          Create and manage campus-wide announcements visible to all users
        </p>
      </div>

      {/* Create Announcement Form */}
      <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-white">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                placeholder="Enter announcement content"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-white">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Pin className="w-4 h-4" />
                  Pin announcement
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300"
            >
              {submitting ? 'Posting...' : 'Post Announcement'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Campus-Wide Announcements ({announcements.length})
        </h2>

        {loading ? (
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-white/70 text-center">Loading announcements...</p>
            </CardContent>
          </Card>
        ) : announcements.length === 0 ? (
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-white/70 text-center">No announcements yet. Create your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center gap-2">
                        {announcement.isPinned && <Pin className="w-4 h-4 text-orange-400" />}
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={
                            announcement.priority === 'high'
                              ? 'bg-red-500/20 text-red-200 border-red-500/50'
                              : announcement.priority === 'normal'
                              ? 'bg-blue-500/20 text-blue-200 border-blue-500/50'
                              : 'bg-gray-500/20 text-gray-200 border-gray-500/50'
                          }
                        >
                          {announcement.priority}
                        </Badge>
                        <span className="text-white/60 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
