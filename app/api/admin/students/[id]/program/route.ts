import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function ensureAdmin() {
  const token = cookies().get("auth-token")?.value || null;
  if (!token) return null;
  
  try {
    const claims: any = await verifyToken(token);
    const rows = await db.select().from(schema.users).where(
      eq(schema.users.id, claims.userId),
    ).limit(1);
    const me = rows?.[0] || null;
    if (!me || me.role !== "admin") return null;
    return me.id as string;
  } catch (_) {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await ensureAdmin();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = params.id;
    const body = await req.json();
    const { programId, yearLevel } = body;

    // Validate student exists and is a student
    const [student] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (student.role !== "student") {
      return NextResponse.json(
        { error: "User is not a student" },
        { status: 400 }
      );
    }

    // Validate program exists if programId is provided
    if (programId) {
      const [program] = await db
        .select()
        .from(schema.programs)
        .where(eq(schema.programs.id, programId))
        .limit(1);

      if (!program) {
        return NextResponse.json(
          { error: "Program not found" },
          { status: 404 }
        );
      }
    }

    // Update student's program and year level
    const updates: any = {};
    if (programId !== undefined) updates.programId = programId;
    if (yearLevel !== undefined) updates.yearLevel = yearLevel;

    await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, studentId));

    return NextResponse.json({
      message: "Student program updated successfully",
      updates,
    });
  } catch (error) {
    console.error("Error updating student program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
