import { NextRequest, NextResponse } from "next/server";
import { getReplitDb, replitSchema } from "@/lib/database/replit-connection";
import { eq } from "drizzle-orm";
import { verifyAuth, requireRole } from "@/lib/auth/api-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getReplitDb();
    const [meeting] = await db
      .select()
      .from(replitSchema.meetings)
      .where(eq(replitSchema.meetings.id, params.id));

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ meeting });
  } catch (error: any) {
    console.error(`GET /api/meetings/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meeting" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireRole(user, ["faculty", "admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only faculty and admin can update meetings" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const db = getReplitDb();

    if (body.scheduledStartTime) {
      body.scheduledStartTime = new Date(body.scheduledStartTime);
    }
    if (body.actualStartTime) {
      body.actualStartTime = new Date(body.actualStartTime);
    }
    if (body.endTime) {
      body.endTime = new Date(body.endTime);
    }

    const [meeting] = await db
      .update(replitSchema.meetings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(replitSchema.meetings.id, params.id))
      .returning();

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ meeting });
  } catch (error: any) {
    console.error(`PATCH /api/meetings/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to update meeting" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireRole(user, ["admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only admin can delete meetings" },
        { status: 403 }
      );
    }

    const db = getReplitDb();
    await db
      .delete(replitSchema.meetings)
      .where(eq(replitSchema.meetings.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/meetings/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
