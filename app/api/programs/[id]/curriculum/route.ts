import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/database/connection";
import { eq, asc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = params.id;

    // Get program info
    const [program] = await db
      .select()
      .from(schema.programs)
      .where(eq(schema.programs.id, programId))
      .limit(1);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Get curriculum with subject details
    const curriculumData = await db
      .select({
        id: schema.curriculum.id,
        yearLevel: schema.curriculum.yearLevel,
        semester: schema.curriculum.semester,
        isElective: schema.curriculum.isElective,
        subject: schema.subjects,
      })
      .from(schema.curriculum)
      .innerJoin(schema.subjects, eq(schema.curriculum.subjectId, schema.subjects.id))
      .where(eq(schema.curriculum.programId, programId))
      .orderBy(asc(schema.curriculum.yearLevel), asc(schema.curriculum.semester));

    // Group by year and semester
    const grouped: Record<string, Record<string, any[]>> = {};
    
    curriculumData.forEach((item) => {
      const year = item.yearLevel;
      const sem = item.semester;
      
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][sem]) grouped[year][sem] = [];
      
      grouped[year][sem].push({
        id: item.id,
        subject: item.subject,
        isElective: item.isElective,
      });
    });

    return NextResponse.json({
      program,
      curriculum: grouped,
      totalSubjects: curriculumData.length,
    });
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
