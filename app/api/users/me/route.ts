import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/api-auth";
import { getReplitDb } from "@/lib/database/replit-connection";
import * as replitSchema from "@/lib/database/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getReplitDb();
    
    const [userData] = await db
      .select({
        id: replitSchema.users.id,
        email: replitSchema.users.email,
        fullName: replitSchema.users.fullName,
        role: replitSchema.users.role,
        createdAt: replitSchema.users.createdAt,
      })
      .from(replitSchema.users)
      .where(eq(replitSchema.users.id, user.userId))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.role,
        firstName: userData.fullName.split(" ")[0] || null,
        lastName: userData.fullName.split(" ").slice(1).join(" ") || null,
        createdAt: userData.createdAt,
      },
    });
  } catch (error: any) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
