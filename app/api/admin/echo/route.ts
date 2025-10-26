import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    let claims: any;
    try {
      claims = await verifyToken(token);
    } catch (e) {
      return NextResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    const rows = await db.select().from(schema.users).where(
      eq(schema.users.id, claims.userId),
    ).limit(1);
    const user = rows?.[0] || null;
    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, {
      status: 500,
    });
  }
}
