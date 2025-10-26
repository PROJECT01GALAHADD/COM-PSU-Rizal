import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { getReplitDb } from "@/lib/database/replit-connection";
import * as replitSchema from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function isValidEmail(email: string) {
  // Accept dev/local emails like admin@local (no TLD) and standard formats
  const re = /^[^\s@]+@[^\s@]+$/;
  return re.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input presence
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Validate email format (basic RFC5322-ish)
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Attempt Replit DB credential check first (users registered via our API)

    try {
      const db = getReplitDb();
      const existingUsers = await db
        .select()
        .from(replitSchema.users)
        .where(eq(replitSchema.users.email, email))
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        const u = existingUsers[0];
        
        // Check if user is active (approved by admin)
        if (u.isActive === false) {
          return NextResponse.json(
            { error: "Your account is pending admin approval. Please wait for an administrator to activate your account." },
            { status: 403 },
          );
        }
        
        if (u.passwordHash) {
          const match = await bcrypt.compare(password, u.passwordHash);
          if (match) {
            const token = await signToken(
              { userId: u.id, email: u.email, userType: u.role as any },
              "24h",
            );
            const res = NextResponse.json(
              {
                user: {
                  id: u.id,
                  email: u.email,
                  userType: u.role,
                  fullName: u.fullName,
                },
                token,
              },
            );
            res.cookies.set("auth-token", token, {
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
              maxAge: 60 * 60 * 24,
            });
            return res;
          }
        }
      }
    } catch (err) {
      console.error("Replit DB login error:", err);
    }

    // If we reach here, credentials were invalid
    return NextResponse.json({ error: "Invalid credentials" }, {
      status: 401,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
