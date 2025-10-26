import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { eq, desc, isNull } from "drizzle-orm";
import { verifyAuth, requireRole } from "@/lib/auth/api-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const campusWide = searchParams.get("campusWide");
    
    const db = getReplitDb();
    
    // Campus-wide announcements are public (no auth required)
    if (campusWide === "true") {
      const announcements = await db
        .select()
        .from(replitSchema.announcements)
        .where(isNull(replitSchema.announcements.courseId))
        .orderBy(desc(replitSchema.announcements.isPinned), desc(replitSchema.announcements.createdAt));
      return NextResponse.json({ announcements });
    }
    
    // For course-specific or all announcements, require authentication
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (courseId) {
      const announcements = await db
        .select()
        .from(replitSchema.announcements)
        .where(eq(replitSchema.announcements.courseId, courseId))
        .orderBy(desc(replitSchema.announcements.isPinned), desc(replitSchema.announcements.createdAt));
      return NextResponse.json({ announcements });
    }

    const announcements = await db
      .select()
      .from(replitSchema.announcements)
      .orderBy(desc(replitSchema.announcements.isPinned), desc(replitSchema.announcements.createdAt));
    return NextResponse.json({ announcements });
  } catch (error: any) {
    console.error("GET /api/announcements error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch announcements" },
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
        { error: "Forbidden: Only faculty and admin can create announcements" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, authorId, courseId, priority, isPinned } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Title, content, and author ID are required" },
        { status: 400 }
      );
    }

    const db = getReplitDb();
    const [announcement] = await db
      .insert(replitSchema.announcements)
      .values({
        title,
        content,
        authorId,
        courseId: courseId || null,
        priority: priority || "normal",
        isPinned: isPinned || false,
      })
      .returning();

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/announcements error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}
