import { NextRequest, NextResponse } from 'next/server'
import { getReplitDb, replitSchema } from '@/lib/database/replit-connection'
import { eq } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const claims: any = await verifyToken(token)
    const db = getReplitDb()
    
    const rows = await db
      .select()
      .from(replitSchema.users)
      .where(eq(replitSchema.users.id, claims.userId))
      .limit(1)
    
    const currentUser = rows?.[0] || null
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Fetch all data
    const allUsers = await db.select().from(replitSchema.users)
    const enrollments = await db.select().from(replitSchema.enrollments)
    const courses = await db.select().from(replitSchema.courses)
    
    // Filter by role
    const students = allUsers.filter(u => u.role === 'student')
    const faculty = allUsers.filter(u => u.role === 'faculty')
    const admins = allUsers.filter(u => u.role === 'admin')
    
    // Active vs pending
    const activeStudents = students.filter(u => u.isActive)
    const activeFaculty = faculty.filter(u => u.isActive)
    const pendingStudents = students.filter(u => !u.isActive)
    const pendingFaculty = faculty.filter(u => !u.isActive)

    const activeCourses = courses.filter(c => c.isActive)

    // Students by year level
    const studentsByYear = [
      { year: '1st Year', count: students.filter(s => s.yearLevel === '1').length },
      { year: '2nd Year', count: students.filter(s => s.yearLevel === '2').length },
      { year: '3rd Year', count: students.filter(s => s.yearLevel === '3').length },
      { year: '4th Year', count: students.filter(s => s.yearLevel === '4').length },
    ]

    // Students by program
    const studentsByProgram = students.reduce((acc, student) => {
      const programId = student.programId || 'Unassigned'
      acc[programId] = (acc[programId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent students (last 5)
    const recentStudents = students
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        email: s.email,
        fullName: s.fullName,
        createdAt: s.createdAt,
        isActive: s.isActive,
      }))

    // Recent faculty (last 5)
    const recentFaculty = faculty
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(f => ({
        id: f.id,
        email: f.email,
        fullName: f.fullName,
        createdAt: f.createdAt,
        isActive: f.isActive,
      }))

    const stats = {
      totalUsers: allUsers.length,
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalAdmins: admins.length,
      activeStudents: activeStudents.length,
      activeFaculty: activeFaculty.length,
      pendingStudents: pendingStudents.length,
      pendingFaculty: pendingFaculty.length,
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter(e => e.status === 'enrolled').length,
      totalCourses: courses.length,
      activeCourses: activeCourses.length,
      studentsByYear,
      studentsByProgram,
      recentStudents,
      recentFaculty,
    }

    return NextResponse.json({ stats })
  } catch (err: any) {
    console.error('Admin stats error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
