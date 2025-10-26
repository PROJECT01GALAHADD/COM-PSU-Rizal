import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "../../../lib/db/connection";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(sql`select now() as now`);
    const now = (result as any)?.rows?.[0]?.now ?? null;
    return NextResponse.json({ ok: true, now });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}