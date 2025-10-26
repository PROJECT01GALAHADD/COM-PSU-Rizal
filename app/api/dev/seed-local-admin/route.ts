import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // Only allow in non-production environments
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden in production" }, {
        status: 403,
      });
    }

    const body = await req.json().catch(() => ({} as any));
    const email: string = body.email || "admin@psu.edu";
    const password: string = body.password || "ChangeMe123!";
    const firstName: string = body.firstName || "System";
    const lastName: string = body.lastName || "Admin";

    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, {
        status: 400,
      });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (existing && existing.length > 0) {
      // Update existing row to ensure admin role and active status
      await db
        .update(schema.users)
        .set({
          passwordHash: hash,
          firstName,
          lastName,
          userType: "admin",
          isActive: true,
        })
        .where(eq(schema.users.email, email));

      return NextResponse.json({ ok: true, updated: true, email });
    }

    // Insert a new admin row
    const inserted = await db
      .insert(schema.users)
      .values({
        email,
        passwordHash: hash,
        firstName,
        lastName,
        userType: "admin",
        isActive: true,
      })
      .returning();

    const user = inserted?.[0] || null;
    return NextResponse.json({ ok: true, created: true, email, id: user?.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, {
      status: 500,
    });
  }
}
