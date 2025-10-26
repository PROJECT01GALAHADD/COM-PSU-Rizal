'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCurriculumPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userDataSession = sessionStorage.getItem('user')
    const userDataLocal = localStorage.getItem('user')
    const userData = userDataSession || userDataLocal

    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== 'admin') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
  }, [router])

  useEffect(() => {
    if (!user) return

    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses', {
          credentials: 'include',
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data = await res.json()
        setCourses(data.courses || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Curriculum</h1>
          <p className="text-gray-400 mb-8">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Curriculum</h1>
          <p className="text-red-400 mb-8">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Curriculum</h1>
        <p className="text-gray-400 mb-8">
          Manage courses and curriculum. {courses.length} course(s) available.
        </p>
        <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Semester</th>
                <th className="px-6 py-4 font-semibold">Academic Year</th>
                <th className="px-6 py-4 font-semibold">Credits</th>
                <th className="px-6 py-4 font-semibold">Active</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                courses.map((c: any) => (
                  <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">{c.code}</td>
                    <td className="px-6 py-4">{c.title}</td>
                    <td className="px-6 py-4">{c.semester || '-'}</td>
                    <td className="px-6 py-4">{c.academicYear || '-'}</td>
                    <td className="px-6 py-4">{c.credits ?? 3}</td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
