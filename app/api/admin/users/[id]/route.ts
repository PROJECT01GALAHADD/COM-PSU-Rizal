import { NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    const id = params.id;
    try {
        const users = await db.select().from(schema.users).where(
            eq(schema.users.id, id),
        );
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }
        return NextResponse.json({ user: users[0] });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
    const key = req.headers.get("x-admin-seed-key");
    const secret = process.env.SUPABASE_SEED_KEY;
    if (!secret || key !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    try {
        const body = await req.json();
        const updateValues: any = {};
        if (body.firstName) updateValues.firstName = body.firstName;
        if (body.lastName) updateValues.lastName = body.lastName;
        if (body.userType) updateValues.userType = body.userType;
        if (body.isActive !== undefined) updateValues.isActive = body.isActive;

        await db.update(schema.users).set(updateValues).where(
            eq(schema.users.id, id),
        );
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    const key = req.headers.get("x-admin-seed-key");
    const secret = process.env.SUPABASE_SEED_KEY;
    if (!secret || key !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    try {
        // Delete from users table
        await db.delete(schema.users).where(eq(schema.users.id, id));

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}
