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
    const courseId = searchParams.get("courseId");
    
    const db = getReplitDb();
    
    if (courseId) {
      const assignments = await db
        .select()
        .from(replitSchema.assignments)
        .where(eq(replitSchema.assignments.courseId, courseId));
      return NextResponse.json({ assignments });
    }

    const assignments = await db.select().from(replitSchema.assignments);
    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error("GET /api/assignments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch assignments" },
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

    if (!requireRole(user, ["faculty", "admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only faculty and admin can create assignments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { courseId, title, description, dueDate, maxPoints, attachmentUrl } = body;

    if (!courseId || !title || !dueDate) {
      return NextResponse.json(
        { error: "Course ID, title, and due date are required" },
        { status: 400 }
      );
    }

    const db = getReplitDb();
    const [assignment] = await db
      .insert(replitSchema.assignments)
      .values({
        courseId,
        title,
        description,
        dueDate: new Date(dueDate),
        maxPoints: maxPoints || 100,
        attachmentUrl,
      })
      .returning();

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/assignments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create assignment" },
      { status: 500 }
    );
  }
}
