import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { verifyAuth, requireRole } from "@/lib/auth/api-auth";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getReplitDb();
    const courses = await db.select().from(replitSchema.courses);
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication and role
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!requireRole(user, ["faculty", "admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only faculty and admin can create courses" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code, title, description, facultyId, semester, academicYear, credits, schedule, classroom } = body;

    if (!code || !title) {
      return NextResponse.json(
        { error: "Code and title are required" },
        { status: 400 }
      );
    }

    const db = getReplitDb();
    const [course] = await db
      .insert(replitSchema.courses)
      .values({
        code,
        title,
        description,
        facultyId,
        semester,
        academicYear,
        credits: credits || 3,
        schedule,
        classroom,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
