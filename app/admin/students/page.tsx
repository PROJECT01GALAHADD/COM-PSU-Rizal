'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UsersManager from '@/components/admin/users-manager'

export default function AdminStudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
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

    async function fetchStudents() {
      try {
        const res = await fetch('/api/admin/users?role=student', {
          credentials: 'include',
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch students')
        }

        const data = await res.json()
        setStudents(data.users || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load students')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [user])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Students</h1>
          <p className="text-gray-400 mb-8">Loading student accounts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Students</h1>
          <p className="text-red-400 mb-8">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Students</h1>
        <p className="text-gray-400 mb-8">
          Manage student accounts and approvals. {students.length} student(s) registered.
        </p>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <UsersManager users={students} />
        </div>
      </div>
    </div>
  )
}
