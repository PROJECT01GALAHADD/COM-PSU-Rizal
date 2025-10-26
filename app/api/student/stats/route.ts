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
    if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden - Student only' }, { status: 403 })
    }

    // Fetch student's enrollments
    const myEnrollments = await db
      .select()
      .from(replitSchema.enrollments)
      .where(eq(replitSchema.enrollments.studentId, currentUser.id))

    // Early return if no enrollments
    if (myEnrollments.length === 0) {
      return NextResponse.json({
        stats: {
          enrolledCourses: 0,
          activeCourses: 0,
          pendingTasks: 0,
          overallGPA: '0.00',
          attendance: 0,
          courses: [],
          upcomingAssignments: [],
          grades: [],
        }
      })
    }

    // Get course IDs
    const courseIds = myEnrollments.map(e => e.courseId)

    // Fetch enrolled courses using SQL filtering
    const myCourses = await db
      .select()
      .from(replitSchema.courses)
      .where(inArray(replitSchema.courses.id, courseIds))

    // Fetch assignments for enrolled courses using SQL filtering
    const myAssignments = await db
      .select()
      .from(replitSchema.assignments)
      .where(inArray(replitSchema.assignments.courseId, courseIds))

    // Fetch student's submissions
    const mySubmissions = await db
      .select()
      .from(replitSchema.submissions)
      .where(eq(replitSchema.submissions.studentId, currentUser.id))

    // Count pending assignments (assignments without submissions)
    const submittedAssignmentIds = mySubmissions.map(s => s.assignmentId)
    const pendingAssignments = myAssignments.filter(a => !submittedAssignmentIds.includes(a.id))

    // Calculate GPA (from enrollment grades)
    const gradePoints: Record<string, number> = {
      '1.00': 4.0, '1.25': 3.75, '1.50': 3.5, '1.75': 3.25,
      '2.00': 3.0, '2.25': 2.75, '2.50': 2.5, '2.75': 2.25,
      '3.00': 2.0, '4.00': 1.0, '5.00': 0.0
    }
    
    const gradesWithPoints = myEnrollments
      .filter(e => e.finalGrade)
      .map(e => gradePoints[e.finalGrade!] || 0)

    const overallGPA = gradesWithPoints.length > 0
      ? (gradesWithPoints.reduce((a, b) => a + b, 0) / gradesWithPoints.length).toFixed(2)
      : '0.00'

    // Calculate attendance (placeholder - would need actual attendance records)
    const attendance = 92 // Default value

    // Format courses with progress
    const coursesWithProgress = myCourses.map(course => {
      const enrollment = myEnrollments.find(e => e.courseId === course.id)
      const courseAssignments = myAssignments.filter(a => a.courseId === course.id)
      const courseSubmissions = mySubmissions.filter(s => 
        courseAssignments.some(a => a.id === s.assignmentId)
      )
      
      const progress = courseAssignments.length > 0
        ? Math.round((courseSubmissions.length / courseAssignments.length) * 100)
        : 0

      return {
        id: course.id,
        code: course.code,
        title: course.title,
        semester: course.semester,
        schedule: course.schedule,
        classroom: course.classroom,
        progress,
        grade: enrollment?.finalGrade || enrollment?.grade || 'N/A',
        status: enrollment?.status || 'enrolled',
      }
    })

    // Get upcoming assignments
    const now = new Date()
    const upcomingAssignments = myAssignments
      .filter(a => new Date(a.dueDate) > now && !submittedAssignmentIds.includes(a.id))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map(a => {
        const course = myCourses.find(c => c.id === a.courseId)
        const submission = mySubmissions.find(s => s.assignmentId === a.id)
        
        return {
          id: a.id,
          title: a.title,
          courseCode: course?.code || 'N/A',
          dueDate: a.dueDate,
          maxPoints: a.maxPoints,
          status: submission ? 'submitted' : 'pending',
          priority: new Date(a.dueDate).getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000 
            ? 'high' 
            : new Date(a.dueDate).getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
            ? 'medium'
            : 'low'
        }
      })

    // Get grades
    const gradesData = myEnrollments.map(e => {
      const course = myCourses.find(c => c.id === e.courseId)
      return {
        courseCode: course?.code || 'N/A',
        courseName: course?.title || 'Unknown',
        midterm: '-', // Would need midterm grade field
        final: e.finalGrade || '-',
        overall: e.finalGrade || '-',
        grade: e.finalGrade || 'N/A',
      }
    })

    const stats = {
      enrolledCourses: myCourses.length,
      activeCourses: myCourses.filter(c => c.isActive).length,
      pendingTasks: pendingAssignments.length,
      overallGPA,
      attendance,
      courses: coursesWithProgress,
      upcomingAssignments,
      grades: gradesData,
    }

    return NextResponse.json({ stats })
  } catch (err: any) {
    console.error('Student stats error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
