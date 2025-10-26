import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

type Role = "admin" | "faculty" | "student" | "guest";

export interface JwtClaims extends JWTPayload {
  userId: string;
  email: string;
  userType: Role;
}

function getJwtSecret() {
  const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET or SUPABASE_JWT_SECRET must be configured in environment variables");
  }
  
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JwtClaims, expiresIn: string = "24h") {
  const secret = getJwtSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtClaims> {
  const secret = getJwtSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload as JwtClaims;
}