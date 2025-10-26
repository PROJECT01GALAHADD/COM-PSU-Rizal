import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { eq } from "drizzle-orm";
import { verifyAuth, requireRole } from "@/lib/auth/api-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    
    const db = getReplitDb();
    
    // Students can only view their own enrollments
    if (user.role === "student" && studentId && studentId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own enrollments" },
        { status: 403 }
      );
    }
    
    if (studentId) {
      const enrollments = await db
        .select()
        .from(replitSchema.enrollments)
        .where(eq(replitSchema.enrollments.studentId, studentId));
      return NextResponse.json({ enrollments });
    }
    
    if (courseId) {
      const enrollments = await db
        .select()
        .from(replitSchema.enrollments)
        .where(eq(replitSchema.enrollments.courseId, courseId));
      return NextResponse.json({ enrollments });
    }

    const enrollments = await db.select().from(replitSchema.enrollments);
    
    // Filter by student if student role
    if (user.role === "student") {
      const filtered = enrollments.filter(e => e.studentId === user.userId);
      return NextResponse.json({ enrollments: filtered });
    }
    
    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error("GET /api/enrollments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "Student ID and course ID are required" },
        { status: 400 }
      );
    }

    // Students can only enroll themselves
    if (user.role === "student" && studentId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only enroll yourself" },
        { status: 403 }
      );
    }

    const db = getReplitDb();
    const [enrollment] = await db
      .insert(replitSchema.enrollments)
      .values({
        studentId,
        courseId,
        status: "enrolled",
      })
      .returning();

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/enrollments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create enrollment" },
      { status: 500 }
    );
  }
}
