'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { isDemoMode } from '@/utils/demo'

export function RegistrationModal({
  trigger,
  defaultOpen = false,
}: {
  trigger?: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [activeType, setActiveType] = useState<'student' | 'faculty'>('student')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [studentId, setStudentId] = useState('')
  const [facultyId, setFacultyId] = useState('')
  const [department, setDepartment] = useState('')
  const [yearLevel, setYearLevel] = useState('')
  const [course, setCourse] = useState('')

  const [idFile, setIdFile] = useState<File | null>(null)

  const searchParams = useSearchParams()
  useEffect(() => {
    if (defaultOpen) {
      setOpen(true)
    }
  }, [defaultOpen])

  useEffect(() => {
    if (searchParams?.get('register') === '1') {
      setOpen(true)
    }
  }, [searchParams])

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setStudentId('')
    setFacultyId('')
    setDepartment('')
    setYearLevel('')
    setCourse('')
    setIdFile(null)
    setActiveType('student')
  }

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Demo-mode: suppress API registration
    if (isDemoMode()) {
      alert('Demo mode: Registration is simulated and not persisted.')
      setOpen(false)
      resetForm()
      return
    }
    if (!email || !password) {
      alert('Email and password are required')
      return
    }
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (activeType === 'student' && !studentId) {
      alert('Student ID is required for student registration')
      return
    }
    if (activeType === 'faculty' && !facultyId) {
      alert('Faculty ID is required for faculty registration')
      return
    }
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('firstName', firstName)
      formData.append('lastName', lastName)
      formData.append('userType', activeType)
      if (activeType === 'student') {
        formData.append('studentId', studentId)
        if (yearLevel) formData.append('yearLevel', yearLevel)
        if (course) formData.append('course', course)
      }
      if (activeType === 'faculty') {
        formData.append('facultyId', facultyId)
        if (department) formData.append('department', department)
      }
      if (idFile) formData.append('idFile', idFile)

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Registration failed')
      }

      // Handle pending approval
      if (data?.pending || data?.user?.isActive === false) {
        alert(
          'Registration submitted. An admin must approve your account before you can sign in.'
        )
        setOpen(false)
        resetForm()
        return
      }

      const dest = activeType === 'student' ? '/student' : '/faculty'
      window.location.href = dest
      setOpen(false)
      resetForm()
    } catch (e: any) {
      alert(e?.message || 'Unexpected error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => setOpen(v)}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-6 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-400 hover:to-orange-300 transition-all duration-300"
            onClick={() => setOpen(true)}
          >
            Register
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl text-white">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src="/icons/PSU-logo.svg"
              alt="PSU logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
              Create Account
            </span>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Join COM
          </DialogTitle>
          <p className="text-center text-white/70 text-sm">
            Sign up to access meetings and collaboration tools
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs defaultValue={activeType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
              <TabsTrigger
                value="student"
                onClick={() => setActiveType('student')}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400"
              >
                Student
              </TabsTrigger>
              <TabsTrigger
                value="faculty"
                onClick={() => setActiveType('faculty')}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400"
              >
                Faculty
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/90">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/90">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>
            </div>

            {activeType === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-white/90">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    required
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearLevel" className="text-white/90">
                    Year Level (optional)
                  </Label>
                  <Input
                    id="yearLevel"
                    value={yearLevel}
                    onChange={e => setYearLevel(e.target.value)}
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="course" className="text-white/90">
                    Course (optional)
                  </Label>
                  <Input
                    id="course"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
              </div>
            )}

            {activeType === 'faculty' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="facultyId" className="text-white/90">
                    Faculty ID
                  </Label>
                  <Input
                    id="facultyId"
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    required
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white/90">
                    Department (optional)
                  </Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="idFile" className="text-white/90">
                Upload School ID (image/pdf)
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="idFile"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => setIdFile(e.target.files?.[0] || null)}
                  className="bg-white/10 border-white/20 text-white file:text-white file:bg-white/10 file:border-white/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!idFile}
                  className="bg-white/10 text-white border-white/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {idFile ? idFile.name : 'No file selected'}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-orange-300 hover:shadow-orange-500/40"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
