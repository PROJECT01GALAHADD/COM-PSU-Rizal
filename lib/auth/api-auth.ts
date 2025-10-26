import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    // Get token from cookies or authorization header
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    // Verify token
    const rawSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;

    if (!rawSecret) {
      console.error("JWT_SECRET not configured");
      return null;
    }

    const secret = new TextEncoder().encode(rawSecret);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as {
      userId: string;
      email: string;
      userType?: string;
    };

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.userType || "guest",
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export function requireAuth(user: AuthUser | null): user is AuthUser {
  return user !== null;
}

export function requireRole(user: AuthUser | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
