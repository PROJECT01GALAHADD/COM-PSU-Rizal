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
    const [submission] = await db
      .select()
      .from(replitSchema.submissions)
      .where(eq(replitSchema.submissions.id, params.id));

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Students can only view their own submissions
    if (user.role === "student" && submission.studentId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own submissions" },
        { status: 403 }
      );
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error(`GET /api/submissions/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submission" },
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

    const db = getReplitDb();

    // Fetch the existing submission first to verify ownership
    const [existingSubmission] = await db
      .select()
      .from(replitSchema.submissions)
      .where(eq(replitSchema.submissions.id, params.id));

    if (!existingSubmission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const body = await req.json();
    const isGradingOperation = body.pointsAwarded !== undefined || body.feedback !== undefined;

    // Check authorization based on operation type
    if (isGradingOperation) {
      // Only faculty and admin can grade
      if (!requireRole(user, ["faculty", "admin"])) {
        return NextResponse.json(
          { error: "Forbidden: Only faculty and admin can grade submissions" },
          { status: 403 }
        );
      }
      body.gradedDate = new Date();
      body.graderId = user.userId;
    } else {
      // For non-grading updates, students can only update their own submissions
      // Faculty and admin can update any submission
      if (user.role === "student" && existingSubmission.studentId !== user.userId) {
        return NextResponse.json(
          { error: "Forbidden: You can only update your own submissions" },
          { status: 403 }
        );
      }
      // Faculty/admin can update submissions only for grading purposes
      if (requireRole(user, ["faculty", "admin"]) && !isGradingOperation) {
        // Allow faculty/admin to update non-grading fields too
      }
    }

    const [submission] = await db
      .update(replitSchema.submissions)
      .set(body)
      .where(eq(replitSchema.submissions.id, params.id))
      .returning();

    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error(`PATCH /api/submissions/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to update submission" },
      { status: 500 }
    );
  }
}
