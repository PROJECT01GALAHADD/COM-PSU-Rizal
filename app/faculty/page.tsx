'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FacultyHeader } from '@/components/faculty-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Video,
  Calendar,
  FileText,
} from 'lucide-react'

interface FacultyStats {
  totalClasses: number
  activeClasses: number
  totalStudents: number
  pendingGrades: number
  avgAttendance: number
  courses: Array<{
    id: string
    code: string
    title: string
    studentCount: number
    schedule: string | null
    classroom: string | null
    isActive: boolean
  }>
  recentAssignments: Array<{
    id: string
    title: string
    courseCode: string
    dueDate: string
    submissions: number
    totalStudents: number
  }>
}

export default function FacultyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<FacultyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData)
        if (demoUser?.role === 'faculty' || demoUser?.role === 'admin') {
          setUser(demoUser)
          fetchStats()
          return
        }
      }
    } catch {}

    const userStr = sessionStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(userStr)
    if (userData.role !== 'faculty' && userData.role !== 'admin') {
      router.push('/login')
      return
    }
    setUser(userData)
    fetchStats()
  }, [router])

  async function fetchStats() {
    try {
      setLoading(true)
      const response = await fetch('/api/faculty/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (err: any) {
      console.error('Failed to fetch faculty stats:', err)
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 w-full h-full bg-com-landing rotate-180" />
      <div className="fixed inset-0 -z-10 bg-black/40" />

      <FacultyHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name || user.fullName || 'Faculty'}!
          </h1>
          <p className="text-white/70">Here's your teaching overview</p>
        </div>

        {error && (
          <Card className="liquid-glass border border-red-500/50 bg-red-500/10 backdrop-blur-xl mb-6">
            <CardContent className="pt-6">
              <p className="text-red-200 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
            <CardContent className="pt-6">
              <p className="text-white/70 text-center">Loading dashboard data...</p>
            </CardContent>
          </Card>
        ) : stats ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Total Classes</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.totalClasses}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Total Students</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.totalStudents}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Pending Grades</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.pendingGrades}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Avg. Attendance</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.avgAttendance}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Classes */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">My Classes</h2>
              {stats.courses.length === 0 ? (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-white/70 text-center">No courses assigned yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stats.courses.map((course) => (
                    <Card
                      key={course.id}
                      className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl text-white">{course.code}</CardTitle>
                            <p className="text-sm text-white/70 mt-1">{course.title}</p>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/30">
                            {course.studentCount} Students
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {course.schedule && (
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Calendar className="w-4 h-4" />
                            <span>{course.schedule}</span>
                          </div>
                        )}
                        {course.classroom && (
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.classroom}</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => router.push('/meetings/create')}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Start Class
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Assignments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Recent Assignments</h2>
              {stats.recentAssignments.length === 0 ? (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-white/70 text-center">No assignments yet</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {stats.recentAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-orange-300" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{assignment.title}</p>
                              <p className="text-sm text-white/70">{assignment.courseCode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">
                              {assignment.submissions} / {assignment.totalStudents}
                            </p>
                            <p className="text-xs text-white/70">Submissions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : null}
      </main>

      <AppverseFooter />
    </div>
  )
}
