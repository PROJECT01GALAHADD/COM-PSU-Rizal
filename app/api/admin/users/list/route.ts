import { NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";

export async function GET() {
    const apiKey = process.env.SUPABASE_SEED_KEY;
    // For listing via browser, allow but recommend using server-to-server with key
    try {
        const users = await db.select().from(schema.users);
        return NextResponse.json({ users });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || String(err) }, {
            status: 500,
        });
    }
}
