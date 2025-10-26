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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getReplitDb();
    const [course] = await db
      .select()
      .from(replitSchema.courses)
      .where(eq(replitSchema.courses.id, params.id));

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error(`GET /api/courses/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch course" },
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!requireRole(user, ["faculty", "admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only faculty and admin can update courses" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const db = getReplitDb();

    const [course] = await db
      .update(replitSchema.courses)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(replitSchema.courses.id, params.id))
      .returning();

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error(`PATCH /api/courses/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to update course" },
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!requireRole(user, ["admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only admin can delete courses" },
        { status: 403 }
      );
    }

    const db = getReplitDb();
    await db
      .delete(replitSchema.courses)
      .where(eq(replitSchema.courses.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/courses/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}
