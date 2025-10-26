'use client'
import React, { useState } from 'react'
import { isDemoMode } from '@/utils/demo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function UsersManager({ users: initialUsers }: any) {
  const [users, setUsers] = useState<any[]>(initialUsers || [])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    userType: 'student',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (isDemoMode()) {
        alert('Demo mode: this action is disabled. Use local mock users instead.')
        setLoading(false)
        return
      }
      
      if (!form.email || !form.fullName) {
        throw new Error('Email and full name are required')
      }

      const payload = {
        email: form.email,
        password: form.password || 'DefaultPassword123!',
        role: form.userType,
        fullName: form.fullName,
        userType: form.userType,
      }
      
      const res = await fetch('/api/admin/proxy/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Create failed')
      
      setUsers(prev => [
        {
          id: data.id,
          email: form.email,
          fullName: form.fullName,
          role: form.userType,
          isActive: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      
      setForm({
        email: '',
        fullName: '',
        userType: 'student',
        password: '',
      })
      
      setSuccess(`User ${form.fullName} created successfully! Awaiting approval.`)
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id: string, userFullName: string) {
    if (!confirm(`Delete user "${userFullName}"? This will remove all associated data.`)) {
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (isDemoMode()) {
        alert('Demo mode: deletion is disabled. Manage users via mock data instead.')
        setLoading(false)
        return
      }
      
      const res = await fetch(`/api/admin/proxy/users/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Delete failed')
      
      setUsers(prev => prev.filter((u: any) => u.id !== id))
      setSuccess(`User ${userFullName} deleted successfully`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  async function approveUser(id: string, userFullName: string) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (isDemoMode()) {
        alert('Demo mode: approval is disabled. Use local mock flags for isActive.')
        setLoading(false)
        return
      }
      
      const res = await fetch(`/api/admin/proxy/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Approve failed')
      
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, isActive: true } : u))
      )
      
      setSuccess(`User ${userFullName} approved successfully!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="user@psu.edu.ph"
                />
              </div>

              <div>
                <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div>
                <Label htmlFor="userType" className="text-white">User Type *</Label>
                <Select value={form.userType} onValueChange={(value) => setForm({ ...form, userType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password" className="text-white">Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Leave blank for default"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300"
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-white/60">
                      No users found. Create your first user above.
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white/90 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-white/90 text-sm">
                        {u.fullName || [u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/50 capitalize">
                          {u.role || u.userType || '-'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {u.isActive === undefined ? (
                          <Badge variant="outline" className="border-white/30 text-white/60">
                            Unknown
                          </Badge>
                        ) : u.isActive ? (
                          <Badge className="bg-green-500/20 text-green-200 border-green-500/50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/50">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/70 text-sm">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {u.isActive === false && (
                            <Button
                              onClick={() => approveUser(u.id, u.fullName || u.email)}
                              size="sm"
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-500 text-white"
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteUser(u.id, u.fullName || u.email)}
                            size="sm"
                            variant="destructive"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
