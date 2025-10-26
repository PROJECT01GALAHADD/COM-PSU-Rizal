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
    const [assignment] = await db
      .select()
      .from(replitSchema.assignments)
      .where(eq(replitSchema.assignments.id, params.id));

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error: any) {
    console.error(`GET /api/assignments/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch assignment" },
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
        { error: "Forbidden: Only faculty and admin can update assignments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const db = getReplitDb();

    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate);
    }

    const [assignment] = await db
      .update(replitSchema.assignments)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(replitSchema.assignments.id, params.id))
      .returning();

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error: any) {
    console.error(`PATCH /api/assignments/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to update assignment" },
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

    if (!requireRole(user, ["faculty", "admin"])) {
      return NextResponse.json(
        { error: "Forbidden: Only faculty and admin can delete assignments" },
        { status: 403 }
      );
    }

    const db = getReplitDb();
    await db
      .delete(replitSchema.assignments)
      .where(eq(replitSchema.assignments.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/assignments/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
