import { NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function ensureAdmin() {
    // JWT cookie authentication only
    const token = cookies().get("auth-token")?.value || null;
    if (!token) return null;
    
    try {
        const claims: any = await verifyToken(token);
        const rows = await db.select().from(schema.users).where(
            eq(schema.users.id, claims.userId),
        ).limit(1);
        const me = rows?.[0] || null;
        if (!me || me.role !== "admin") return null;
        return me.id as string;
    } catch (_) {
        return null;
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const adminId = await ensureAdmin();
        if (!adminId) {
            return NextResponse.json({ error: "unauthenticated" }, {
                status: 401,
            });
        }

        const id = params.id;
        await db.delete(schema.users).where(eq(schema.users.id, id));

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const adminId = await ensureAdmin();
        if (!adminId) {
            return NextResponse.json({ error: "unauthenticated" }, {
                status: 401,
            });
        }

        const id = params.id;
        const body = await req.json().catch(() => ({}));

        // Only allow specific fields
        const updates: any = {};
        if (typeof body.isActive === "boolean") {
            updates.isActive = body.isActive;
        }
        if (typeof body.fullName === "string") {
            updates.fullName = body.fullName;
        }
        if (typeof body.role === "string") {
            updates.role = body.role as "student" | "faculty" | "admin" | "guest";
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "no valid fields to update" }, {
                status: 400,
            });
        }

        await db.update(schema.users).set(updates).where(
            eq(schema.users.id, id),
        );

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}
