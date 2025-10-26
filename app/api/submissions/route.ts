import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/lib/auth/api-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    const studentId = searchParams.get("studentId");
    
    const db = getReplitDb();
    
    // Students can only view their own submissions
    if (user.role === "student" && studentId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own submissions" },
        { status: 403 }
      );
    }
    
    if (assignmentId) {
      const submissions = await db
        .select()
        .from(replitSchema.submissions)
        .where(eq(replitSchema.submissions.assignmentId, assignmentId));
      
      // Filter by student if student role
      if (user.role === "student") {
        const filtered = submissions.filter(s => s.studentId === user.userId);
        return NextResponse.json({ submissions: filtered });
      }
      
      return NextResponse.json({ submissions });
    }
    
    if (studentId) {
      const submissions = await db
        .select()
        .from(replitSchema.submissions)
        .where(eq(replitSchema.submissions.studentId, studentId));
      return NextResponse.json({ submissions });
    }

    const submissions = await db.select().from(replitSchema.submissions);
    
    // Filter by student if student role
    if (user.role === "student") {
      const filtered = submissions.filter(s => s.studentId === user.userId);
      return NextResponse.json({ submissions: filtered });
    }
    
    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submissions" },
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
    const { assignmentId, studentId, content, attachmentUrl } = body;

    if (!assignmentId || !studentId) {
      return NextResponse.json(
        { error: "Assignment ID and student ID are required" },
        { status: 400 }
      );
    }

    // Students can only submit for themselves
    if (user.role === "student" && studentId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only submit assignments for yourself" },
        { status: 403 }
      );
    }

    const db = getReplitDb();
    
    // Check if assignment is late
    const [assignment] = await db
      .select()
      .from(replitSchema.assignments)
      .where(eq(replitSchema.assignments.id, assignmentId));
    
    const isLate = assignment ? new Date() > new Date(assignment.dueDate) : false;

    const [submission] = await db
      .insert(replitSchema.submissions)
      .values({
        assignmentId,
        studentId,
        content,
        attachmentUrl,
        isLate,
      })
      .returning();

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create submission" },
      { status: 500 }
    );
  }
}
