import { NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const programs = await db
      .select()
      .from(schema.programs)
      .orderBy(asc(schema.programs.name));

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
