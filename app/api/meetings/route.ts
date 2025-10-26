import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { eq, desc } from "drizzle-orm";
import { verifyAuth, requireRole } from "@/lib/auth/api-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get("hostId");
    const courseId = searchParams.get("courseId");
    const isActive = searchParams.get("isActive");
    
    const db = getReplitDb();
    
    let query = db.select().from(replitSchema.meetings);
    
    if (hostId) {
      query = query.where(eq(replitSchema.meetings.hostId, hostId)) as any;
    } else if (courseId) {
      query = query.where(eq(replitSchema.meetings.courseId, courseId)) as any;
    } else if (isActive === "true") {
      query = query.where(eq(replitSchema.meetings.isActive, true)) as any;
    }
    
    const meetings = await query.orderBy(desc(replitSchema.meetings.createdAt));
    return NextResponse.json({ meetings });
  } catch (error: any) {
    console.error("GET /api/meetings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meetings" },
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
        { error: "Forbidden: Only faculty and admin can create meetings" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, hostId, scheduledStartTime, meetingType, courseId, isPublic, maxParticipants } = body;

    if (!title || !hostId) {
      return NextResponse.json(
        { error: "Title and host ID are required" },
        { status: 400 }
      );
    }

    const db = getReplitDb();
    const [meeting] = await db
      .insert(replitSchema.meetings)
      .values({
        title,
        description,
        hostId,
        scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : null,
        meetingType: meetingType || "other",
        courseId: courseId || null,
        isPublic: isPublic || false,
        maxParticipants: maxParticipants || 50,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/meetings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create meeting" },
      { status: 500 }
    );
  }
}
