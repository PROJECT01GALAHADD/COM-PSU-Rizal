'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Users, Database, Bell, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminManagePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAnnouncements: 0,
    totalEnrollments: 0,
  })

  useEffect(() => {
    // Check admin authentication
    try {
      const demoData = localStorage.getItem('com_demo_auth_v1')
      if (demoData) {
        const demoUser = JSON.parse(demoData)
        if (demoUser.role === 'admin') {
          setUser(demoUser)
          fetchStats()
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
      fetchStats()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }, [router])

  async function fetchStats() {
    try {
      // Fetch real stats from database APIs with authentication
      const [announcementsRes, coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/announcements?campusWide=true', {
          credentials: 'include',
        }).catch((err) => {
          console.error('Failed to fetch announcements:', err)
          return null
        }),
        fetch('/api/courses', {
          credentials: 'include',
        }).catch((err) => {
          console.error('Failed to fetch courses:', err)
          return null
        }),
        fetch('/api/enrollments', {
          credentials: 'include',
        }).catch((err) => {
          console.error('Failed to fetch enrollments:', err)
          return null
        }),
      ])

      const announcementsData = announcementsRes?.ok ? await announcementsRes.json() : { announcements: [] }
      const coursesData = coursesRes?.ok ? await coursesRes.json() : { courses: [] }
      const enrollmentsData = enrollmentsRes?.ok ? await enrollmentsRes.json() : { enrollments: [] }

      // Note: This only counts campus-wide announcements
      // For total users count, a dedicated /api/users/count endpoint would be needed
      setStats({
        totalUsers: 0, // Requires dedicated /api/users/count endpoint
        totalCourses: coursesData.courses?.length || 0,
        totalAnnouncements: announcementsData.announcements?.length || 0,
        totalEnrollments: enrollmentsData.enrollments?.length || 0,
      })

      // Log any API failures for debugging
      if (!announcementsRes?.ok) console.warn('Announcements API failed')
      if (!coursesRes?.ok) console.warn('Courses API failed')
      if (!enrollmentsRes?.ok) console.warn('Enrollments API failed')
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Keep existing stats on error instead of resetting to zero
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Admin Console & Settings
        </h1>
        <p className="text-white/70 mt-2">
          Manage platform settings and access administrative tools
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white/10 border border-white/20 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-white/60 text-sm mt-1">Registered accounts</p>
              </CardContent>
            </Card>

            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Total Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                <p className="text-white/60 text-sm mt-1">Active courses</p>
              </CardContent>
            </Card>

            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.totalAnnouncements}</p>
                <p className="text-white/60 text-sm mt-1">Campus-wide posts</p>
              </CardContent>
            </Card>

            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.totalEnrollments}</p>
                <p className="text-white/60 text-sm mt-1">Student enrollments</p>
              </CardContent>
            </Card>
          </div>

          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 h-auto py-4"
                >
                  <Link href="/admin/students">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-6 h-6" />
                      <span>Manage Students</span>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 h-auto py-4"
                >
                  <Link href="/admin/faculty">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-6 h-6" />
                      <span>Manage Faculty</span>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 h-auto py-4"
                >
                  <Link href="/admin/curriculum">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="w-6 h-6" />
                      <span>Manage Curriculum</span>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 h-auto py-4"
                >
                  <Link href="/admin/announcements">
                    <div className="flex flex-col items-center gap-2">
                      <Bell className="w-6 h-6" />
                      <span>Manage Announcements</span>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 h-auto py-4"
                >
                  <Link href="/admin/users">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="w-6 h-6" />
                      <span>Manage All Users</span>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 h-auto py-4"
                >
                  <Link href="/admin/resources">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="w-6 h-6" />
                      <span>Manage Resources</span>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Management Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white">
                <p>Access detailed management tools from the sidebar:</p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Students - View and manage student accounts</li>
                  <li>Faculty - View and manage faculty accounts</li>
                  <li>Users - View all users in the system</li>
                  <li>Curriculum - Manage courses and academic programs</li>
                  <li>Announcements - Post campus-wide announcements</li>
                  <li>Resources - Upload and manage files</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white">
                <div>
                  <h3 className="text-lg font-semibold mb-2">System Information</h3>
                  <div className="space-y-2 text-white/80">
                    <p><strong>Platform:</strong> PSU Rizal Academic Collaboration Platform</p>
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Database:</strong> Replit PostgreSQL</p>
                    <p><strong>Authentication:</strong> JWT-based</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <h3 className="text-lg font-semibold mb-2">Admin Account</h3>
                  <div className="space-y-2 text-white/80">
                    <p><strong>Name:</strong> {user.name || user.email}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> Administrator</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
