import { parse } from 'csv-parse/sync';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/database/schema";

// Database connection
const databaseUrl = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
const client = postgres(databaseUrl);
const db = drizzle(client, { schema });

interface CsvRow {
  'Course Code': string;
  'Course Title': string;
  'Units': string;
  'Year and Semester': string;
}

interface ProgramData {
  code: string;
  name: string;
  filename: string;
}

// Extract program info from filename
function extractProgramInfo(filename: string): ProgramData {
  const name = filename
    .replace('-subjects.csv', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate code from program name
  const code = filename
    .replace('-subjects.csv', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return { code, name, filename };
}

// Parse year and semester
function parseYearAndSemester(yearSemester: string): { yearLevel: string; semester: string } {
  // Example: "First Year - 1st Sem" or "First Year - Summer"
  const parts = yearSemester.split(' - ');
  const yearLevel = parts[0].trim(); // "First Year", "Second Year", etc.
  const semester = parts[1].trim(); // "1st Sem", "2nd Sem", "Summer"
  
  return { yearLevel, semester };
}

async function importCurriculum() {
  console.log('🎓 Starting curriculum import...\n');
  
  const csvDir = join(process.cwd(), 'public', 'subjects');
  const csvFiles = readdirSync(csvDir).filter(f => f.endsWith('.csv'));
  
  console.log(`Found ${csvFiles.length} CSV files to process\n`);
  
  for (const filename of csvFiles) {
    const programInfo = extractProgramInfo(filename);
    console.log(`📚 Processing: ${programInfo.name} (${programInfo.code})`);
    
    // Read and parse CSV
    const csvPath = join(csvDir, filename);
    const csvContent = readFileSync(csvPath, 'utf-8');
    const rows: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    console.log(`   Found ${rows.length} subjects in CSV`);
    
    // Create or get program
    let programId: string;
    const existingProgram = await db.query.programs.findFirst({
      where: (programs, { eq }) => eq(programs.code, programInfo.code),
    });
    
    if (existingProgram) {
      programId = existingProgram.id;
      console.log(`   ✓ Program already exists (ID: ${programId})`);
    } else {
      const [newProgram] = await db.insert(schema.programs).values({
        code: programInfo.code,
        name: programInfo.name,
        description: `Bachelor's degree program in ${programInfo.name}`,
      }).returning();
      programId = newProgram.id;
      console.log(`   ✓ Created new program (ID: ${programId})`);
    }
    
    let subjectsCreated = 0;
    let subjectsExisting = 0;
    let curriculumLinksCreated = 0;
    
    // Process each subject
    for (const row of rows) {
      const subjectCode = row['Course Code'].trim();
      const subjectTitle = row['Course Title'].trim();
      const units = row['Units'].trim();
      const { yearLevel, semester } = parseYearAndSemester(row['Year and Semester']);
      
      // Check if this is an elective
      const isElective = subjectCode.toLowerCase().includes('elect') || 
                         subjectTitle.toLowerCase().includes('elective');
      
      // Create or get subject
      let subjectId: string;
      const existingSubject = await db.query.subjects.findFirst({
        where: (subjects, { eq }) => eq(subjects.code, subjectCode),
      });
      
      if (existingSubject) {
        subjectId = existingSubject.id;
        subjectsExisting++;
      } else {
        const [newSubject] = await db.insert(schema.subjects).values({
          code: subjectCode,
          title: subjectTitle,
          units: units,
          description: `${subjectTitle} (${units} units)`,
        }).returning();
        subjectId = newSubject.id;
        subjectsCreated++;
      }
      
      // Create curriculum link (program <-> subject mapping)
      const existingCurriculum = await db.query.curriculum.findFirst({
        where: (curriculum, { and, eq }) => and(
          eq(curriculum.programId, programId),
          eq(curriculum.subjectId, subjectId),
        ),
      });
      
      if (!existingCurriculum) {
        await db.insert(schema.curriculum).values({
          programId,
          subjectId,
          yearLevel,
          semester,
          isElective,
        });
        curriculumLinksCreated++;
      }
    }
    
    console.log(`   ✓ Subjects: ${subjectsCreated} created, ${subjectsExisting} existing`);
    console.log(`   ✓ Curriculum links: ${curriculumLinksCreated} created\n`);
  }
  
  // Print summary
  const totalPrograms = await db.query.programs.findMany();
  const totalSubjects = await db.query.subjects.findMany();
  const totalCurriculum = await db.query.curriculum.findMany();
  
  console.log('✅ Import complete!');
  console.log(`\nSummary:`);
  console.log(`  - Programs: ${totalPrograms.length}`);
  console.log(`  - Subjects: ${totalSubjects.length}`);
  console.log(`  - Curriculum links: ${totalCurriculum.length}`);
  
  await client.end();
}

// Run import
importCurriculum()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error during import:', error);
    process.exit(1);
  });
