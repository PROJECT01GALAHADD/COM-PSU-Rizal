import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let email: string;
    let password: string;
    let fullName: string;
    let role: "student" | "faculty" | "admin" | "guest" = "student";

    // Handle both JSON and FormData
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      email = formData.get("email")?.toString() || "";
      password = formData.get("password")?.toString() || "";
      
      const firstName = formData.get("firstName")?.toString() || "";
      const lastName = formData.get("lastName")?.toString() || "";
      fullName = formData.get("fullName")?.toString() || `${firstName} ${lastName}`.trim();
      
      const userType = formData.get("userType")?.toString() || "student";
      role = userType as "student" | "faculty" | "admin" | "guest";
    } else {
      const body = await req.json();
      email = body.email || "";
      password = body.password || "";
      fullName = body.fullName || `${body.firstName || ""} ${body.lastName || ""}`.trim();
      role = body.role || body.userType || "student";
    }

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with isActive=false (pending admin approval)
    const newUser = await db
      .insert(schema.users)
      .values({
        email,
        passwordHash: hashedPassword,
        fullName,
        role,
        isActive: false, // Requires admin approval
      })
      .returning();

    const user = newUser[0];

    // Return success without sensitive data
    return NextResponse.json({
      message: "Registration successful. Your account is pending admin approval.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
