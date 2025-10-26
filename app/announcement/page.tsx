'use client'

import React from 'react'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const priorities = ['all', 'high', 'normal', 'low'] as const

  const [selectedPriority, setSelectedPriority] =
    React.useState<(typeof priorities)[number]>('all')

  React.useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true)
        const response = await fetch('/api/announcements?campusWide=true')
        if (!response.ok) {
          throw new Error('Failed to fetch announcements')
        }
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load announcements')
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  const filtered = announcements.filter(a => {
    const prioOk = selectedPriority === 'all' || a.priority === selectedPriority
    return prioOk
  })

  return (
    <div className="min-h-screen text-white">
      {/* Same Background as Landing Page */}
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
      <div className="fixed inset-0 -z-10 bg-black/40" />
      
      <SiteHeader />

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">Announcements</h1>
            <p className="text-white mt-2">
              Latest campus-wide notices and updates
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {priorities.map(p => (
                <Button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={
                    selectedPriority === p
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white border-0'
                      : 'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'
                  }
                  variant={selectedPriority === p ? 'default' : 'ghost'}
                >
                  {p === 'all'
                    ? 'All Priorities'
                    : p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white/70 py-12">
              Loading announcements...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              No announcements available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(a => (
                <Card key={a.id} className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      {a.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-3">{a.content}</p>
                    <div className="text-sm text-white/60">
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      {a.priority && <span className="ml-2">• {a.priority}</span>}
                      {a.isPinned && <span className="ml-2">• 📌 Pinned</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <AppverseFooter />
    </div>
  )
}
