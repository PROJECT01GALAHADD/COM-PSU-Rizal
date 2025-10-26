import { NextRequest, NextResponse } from "next/server";
import { getReplitDb } from "@/lib/database/replit-connection";
import * as replitSchema from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      password, 
      fullName,
      role = "student"
    } = await req.json();

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    const db = getReplitDb();

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(replitSchema.users)
      .where(eq(replitSchema.users.email, email));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await db.insert(replitSchema.users).values({
      email,
      passwordHash: hashedPassword,
      fullName,
      role: role as "student" | "faculty" | "admin" | "guest",
    }).returning();

    const user = newUser[0];

    // Generate JWT token using unified auth library
    const token = await signToken(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.role
      },
      "24h"
    );

    // Return user data and token
    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.role,
    };

    const res = NextResponse.json({
      user: userData,
      token,
    }, { status: 201 });
    
    // Set auth cookie for automatic login after signup
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });
    
    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}