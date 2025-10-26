import { NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // JWT authentication - verify admin role
    const token = cookies().get("auth-token")?.value || null;
    if (!token) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }
    
    let claims: any;
    try {
      claims = await verifyToken(token);
    } catch (_) {
      return NextResponse.json({ error: "invalid_token" }, { status: 401 });
    }
    
    const rows = await db.select().from(schema.users).where(
      eq(schema.users.id, claims.userId),
    ).limit(1);
    const me = rows?.[0] || null;
    if (!me || me.role !== "admin") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const adminUserId = me.id as string;

    const body = await req.json();
    const email = body.email;
    const password = body.password || "ChangeMe123!";
    const fullName = body.fullName || body.name || "";
    const role = body.role || body.userType || "student";

    if (!email || !fullName) {
      return NextResponse.json({ error: "email and fullName required" }, { status: 400 });
    }

    // Conflict check
    const existingByEmail = await db.select().from(schema.users).where(
      eq(schema.users.email, email),
    );
    if (existingByEmail && existingByEmail.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Create user in local database with hashed password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const inserted = await db
      .insert(schema.users)
      .values({
        email,
        passwordHash: hash,
        fullName,
        role: role as "student" | "faculty" | "admin" | "guest",
        isActive: true,
      })
      .returning();

    const user = inserted?.[0] || null;
    return NextResponse.json({ ok: true, id: user?.id, provider: "local" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, {
      status: 500,
    });
  }
}
