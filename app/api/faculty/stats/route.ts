import { NextRequest, NextResponse } from 'next/server'
import { getReplitDb, replitSchema } from '@/lib/database/replit-connection'
import { eq, inArray } from 'drizzle-orm'
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
    if (!currentUser || (currentUser.role !== 'faculty' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden - Faculty only' }, { status: 403 })
    }

    // Fetch faculty's courses
    const myCourses = await db
      .select()
      .from(replitSchema.courses)
      .where(eq(replitSchema.courses.facultyId, currentUser.id))

    // Early return if no courses
    if (myCourses.length === 0) {
      return NextResponse.json({
        stats: {
          totalClasses: 0,
          activeClasses: 0,
          totalStudents: 0,
          pendingGrades: 0,
          avgAttendance: 0,
          courses: [],
          recentAssignments: [],
        }
      })
    }

    const courseIds = myCourses.map(c => c.id)

    // Fetch enrollments for faculty's courses using SQL filtering
    const myEnrollments = await db
      .select()
      .from(replitSchema.enrollments)
      .where(inArray(replitSchema.enrollments.courseId, courseIds))

    // Fetch assignments for faculty's courses using SQL filtering
    const myAssignments = await db
      .select()
      .from(replitSchema.assignments)
      .where(inArray(replitSchema.assignments.courseId, courseIds))

    // Fetch submissions for faculty's assignments using SQL filtering
    const assignmentIds = myAssignments.map(a => a.id)
    const mySubmissions = assignmentIds.length > 0
      ? await db
          .select()
          .from(replitSchema.submissions)
          .where(inArray(replitSchema.submissions.assignmentId, assignmentIds))
      : []

    // Get unique students enrolled in faculty's courses
    const uniqueStudentIds = [...new Set(myEnrollments.map(e => e.studentId))]

    // Count pending grades (submissions without pointsAwarded)
    const pendingGrades = mySubmissions.filter(s => s.pointsAwarded === null || s.pointsAwarded === undefined).length

    // Calculate average attendance (placeholder - would need attendance records)
    const avgAttendance = 89 // Default value since we don't have attendance tracking yet

    // Get active courses
    const activeCourses = myCourses.filter(c => c.isActive)

    // Format courses with enrollment counts
    const coursesWithStats = myCourses.map(course => {
      const courseEnrollments = myEnrollments.filter(e => e.courseId === course.id)
      const courseAssignments = myAssignments.filter(a => a.courseId === course.id)
      
      return {
        id: course.id,
        code: course.code,
        title: course.title,
        description: course.description,
        semester: course.semester,
        academicYear: course.academicYear,
        schedule: course.schedule,
        classroom: course.classroom,
        studentCount: courseEnrollments.length,
        assignmentCount: courseAssignments.length,
        isActive: course.isActive,
      }
    })

    // Get recent assignments
    const recentAssignments = myAssignments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(a => {
        const course = myCourses.find(c => c.id === a.courseId)
        const submissions = mySubmissions.filter(s => s.assignmentId === a.id)
        const totalStudents = myEnrollments.filter(e => e.courseId === a.courseId).length
        
        return {
          id: a.id,
          title: a.title,
          courseCode: course?.code || 'N/A',
          dueDate: a.dueDate,
          submissions: submissions.length,
          totalStudents,
          maxPoints: a.maxPoints,
        }
      })

    const stats = {
      totalClasses: myCourses.length,
      activeClasses: activeCourses.length,
      totalStudents: uniqueStudentIds.length,
      pendingGrades,
      avgAttendance,
      courses: coursesWithStats,
      recentAssignments,
    }

    return NextResponse.json({ stats })
  } catch (err: any) {
    console.error('Faculty stats error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
