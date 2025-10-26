'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudentHeader } from '@/components/student-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  Video,
  Calendar,
  GraduationCap,
} from 'lucide-react'

interface StudentStats {
  enrolledCourses: number
  activeCourses: number
  pendingTasks: number
  overallGPA: string
  attendance: number
  courses: Array<{
    id: string
    code: string
    title: string
    schedule: string | null
    classroom: string | null
    progress: number
    grade: string
    status: string
  }>
  upcomingAssignments: Array<{
    id: string
    title: string
    courseCode: string
    dueDate: string
    status: string
    priority: string
  }>
  grades: Array<{
    courseCode: string
    courseName: string
    midterm: string
    final: string
    overall: string
    grade: string
  }>
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData)
        if (demoUser?.role === 'student' || demoUser?.role === 'admin') {
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
    if (userData.role !== 'student' && userData.role !== 'admin') {
      router.push('/login')
      return
    }
    setUser(userData)
    fetchStats()
  }, [router])

  async function fetchStats() {
    try {
      setLoading(true)
      const response = await fetch('/api/student/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (err: any) {
      console.error('Failed to fetch student stats:', err)
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

      <StudentHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name || user.fullName || 'Student'}!
          </h1>
          <p className="text-white/70">Here's your academic overview</p>
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
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Enrolled Courses</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.enrolledCourses}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Pending Tasks</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.pendingTasks}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Overall GPA</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.overallGPA}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium">Attendance</p>
                      <p className="text-4xl font-bold text-white mt-1">{stats.attendance}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Courses */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">My Courses</h2>
              {stats.courses.length === 0 ? (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-white/70 text-center">No courses enrolled yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.courses.map((course, i) => {
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-purple-500 to-purple-600',
                      'from-green-500 to-green-600',
                      'from-orange-500 to-orange-600',
                      'from-pink-500 to-pink-600',
                      'from-cyan-500 to-cyan-600',
                    ]
                    const color = colors[i % colors.length]

                    return (
                      <Card
                        key={course.id}
                        className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
                      >
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg text-white">{course.code}</CardTitle>
                          <p className="text-sm text-white/70">{course.title}</p>
                          {course.schedule && (
                            <p className="text-xs text-white/50 mt-1">{course.schedule}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Progress</span>
                              <span className="text-white font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 bg-white/10" />
                            <Button
                              onClick={() => router.push('/meetings/create')}
                              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Enter Class
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Assignments */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Upcoming Assignments</h2>
              {stats.upcomingAssignments.length === 0 ? (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-white/70 text-center">No pending assignments</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {stats.upcomingAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start gap-3 flex-grow">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                assignment.priority === 'high'
                                  ? 'bg-red-500/20'
                                  : assignment.priority === 'medium'
                                    ? 'bg-yellow-500/20'
                                    : 'bg-green-500/20'
                              }`}
                            >
                              <FileText
                                className={`w-5 h-5 ${
                                  assignment.priority === 'high'
                                    ? 'text-red-400'
                                    : assignment.priority === 'medium'
                                      ? 'text-yellow-400'
                                      : 'text-green-400'
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{assignment.title}</p>
                              <p className="text-sm text-white/70">{assignment.courseCode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/70">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                            <span
                              className={`text-xs px-3 py-1 rounded-full mt-1 inline-block ${
                                assignment.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {assignment.status === 'pending' ? 'Not Started' : 'Submitted'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Current Grades */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Current Grades</h2>
              {stats.grades.length === 0 ? (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <p className="text-white/70 text-center">No grades available yet</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/70 font-semibold">Course</th>
                            <th className="text-center py-3 px-4 text-white/70 font-semibold">Midterm</th>
                            <th className="text-center py-3 px-4 text-white/70 font-semibold">Final</th>
                            <th className="text-center py-3 px-4 text-white/70 font-semibold">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.grades.map((grade, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-white font-medium">{grade.courseCode}</td>
                              <td className="py-3 px-4 text-center text-white/90">{grade.midterm}</td>
                              <td className="py-3 px-4 text-center text-white/90">{grade.final}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">
                                  {grade.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
