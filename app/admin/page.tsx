'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, GraduationCap, UserCog, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface DemoUser {
  id: string
  email: string
  name: string
  role: 'student' | 'faculty' | 'admin'
}

interface AdminStats {
  totalStudents: number
  totalFaculty: number
  totalAdmins: number
  activeStudents: number
  activeFaculty: number
  pendingStudents: number
  pendingFaculty: number
  totalCourses: number
  activeCourses: number
  activeEnrollments: number
  studentsByYear: Array<{ year: string; count: number }>
  recentStudents: Array<{ id: string; email: string; fullName: string; createdAt: string; isActive: boolean }>
  recentFaculty: Array<{ id: string; email: string; fullName: string; createdAt: string; isActive: boolean }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check demo mode first
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData) as DemoUser
        if (demoUser.role === 'admin') {
          fetchStats()
          return
        }
      }

      // Check sessionStorage for real auth
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
      
      fetchStats()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }, [router])

  async function fetchStats() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (err: any) {
      console.error('Failed to fetch admin stats:', err)
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
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
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/80">Real-time overview and management for the PSU Rizal platform</p>
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
            {/* Top Stats Grid - Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Students
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.totalStudents}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <p className="text-xs text-green-400">
                      {stats.activeStudents} active
                    </p>
                    {stats.pendingStudents > 0 && (
                      <>
                        <Clock className="h-3 w-3 text-yellow-400 ml-2" />
                        <p className="text-xs text-yellow-400">
                          {stats.pendingStudents} pending
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Faculty
                  </CardTitle>
                  <Users className="h-5 w-5 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.totalFaculty}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <p className="text-xs text-green-400">
                      {stats.activeFaculty} active
                    </p>
                    {stats.pendingFaculty > 0 && (
                      <>
                        <Clock className="h-3 w-3 text-yellow-400 ml-2" />
                        <p className="text-xs text-yellow-400">
                          {stats.pendingFaculty} pending
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Active Courses
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.activeCourses}</div>
                  <p className="text-xs text-white/60 mt-2">
                    {stats.totalCourses} total courses
                  </p>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Enrollments
                  </CardTitle>
                  <UserCog className="h-5 w-5 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.activeEnrollments}</div>
                  <p className="text-xs text-white/60 mt-2">
                    Active enrollments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Management Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Student Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Total Students:</span>
                      <span className="text-white font-semibold">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Active:</span>
                      <span className="text-green-400 font-semibold">{stats.activeStudents}</span>
                    </div>
                    {stats.pendingStudents > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Pending Approval:</span>
                        <span className="text-yellow-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {stats.pendingStudents}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400">
                      <Link href="/admin/students">View All Students</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Faculty Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Total Faculty:</span>
                      <span className="text-white font-semibold">{stats.totalFaculty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Active:</span>
                      <span className="text-green-400 font-semibold">{stats.activeFaculty}</span>
                    </div>
                    {stats.pendingFaculty > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Pending Approval:</span>
                        <span className="text-yellow-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {stats.pendingFaculty}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400">
                      <Link href="/admin/faculty">View All Faculty</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <Link href="/admin/announcements">Announcements</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Student Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentStudents.length === 0 ? (
                    <p className="text-white/60 text-center py-4">No students registered yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                          <div>
                            <p className="text-white font-medium">{student.fullName}</p>
                            <p className="text-white/60 text-sm">{student.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.isActive ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                Active
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Pending
                              </span>
                            )}
                            <span className="text-xs text-white/50">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Faculty */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Faculty Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentFaculty.length === 0 ? (
                    <p className="text-white/60 text-center py-4">No faculty registered yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentFaculty.map((faculty) => (
                        <div key={faculty.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                          <div>
                            <p className="text-white font-medium">{faculty.fullName}</p>
                            <p className="text-white/60 text-sm">{faculty.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {faculty.isActive ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                Active
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Pending
                              </span>
                            )}
                            <span className="text-xs text-white/50">
                              {new Date(faculty.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}
