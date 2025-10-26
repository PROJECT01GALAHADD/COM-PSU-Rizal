import { db } from "../lib/database/connection";
import { sql } from "drizzle-orm";

async function createTables() {
  console.log("Creating tables in Replit PostgreSQL database...");

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'guest')),
        full_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("✓ Created users table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        faculty_id UUID REFERENCES users(id),
        semester TEXT,
        academic_year TEXT,
        credits INTEGER DEFAULT 3,
        schedule TEXT,
        classroom TEXT,
        syllabus_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `);
    console.log("✓ Created courses table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meetings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        host_id UUID NOT NULL REFERENCES users(id),
        scheduled_start_time TIMESTAMP,
        actual_start_time TIMESTAMP,
        end_time TIMESTAMP,
        is_public BOOLEAN DEFAULT false,
        max_participants INTEGER DEFAULT 50,
        meeting_type TEXT DEFAULT 'other' CHECK (meeting_type IN ('lecture', 'group_discussion', 'office_hours', 'exam', 'other')),
        course_id UUID REFERENCES courses(id),
        recording_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `);
    console.log("✓ Created meetings table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        meeting_id UUID NOT NULL REFERENCES meetings(id),
        user_id UUID REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT,
        is_host BOOLEAN DEFAULT false,
        is_muted BOOLEAN DEFAULT false,
        is_camera_off BOOLEAN DEFAULT false,
        is_screen_sharing BOOLEAN DEFAULT false,
        join_time TIMESTAMP DEFAULT NOW(),
        leave_time TIMESTAMP,
        role TEXT DEFAULT 'participant' CHECK (role IN ('host', 'cohost', 'participant', 'guest'))
      );
    `);
    console.log("✓ Created participants table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        meeting_id UUID NOT NULL REFERENCES meetings(id),
        participant_id UUID NOT NULL REFERENCES participants(id),
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        is_deleted BOOLEAN DEFAULT false
      );
    `);
    console.log("✓ Created chat_messages table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id),
        course_id UUID NOT NULL REFERENCES courses(id),
        enrollment_date TIMESTAMP DEFAULT NOW() NOT NULL,
        status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
        grade TEXT,
        final_grade TEXT
      );
    `);
    console.log("✓ Created enrollments table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID NOT NULL REFERENCES courses(id),
        title TEXT NOT NULL,
        description TEXT,
        due_date TIMESTAMP NOT NULL,
        max_points INTEGER DEFAULT 100,
        attachment_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("✓ Created assignments table");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id UUID NOT NULL REFERENCES assignments(id),
        student_id UUID NOT NULL REFERENCES users(id),
        submission_date TIMESTAMP DEFAULT NOW() NOT NULL,
        content TEXT,
        attachment_url TEXT,
        points_awarded INTEGER,
        feedback TEXT,
        graded_date TIMESTAMP,
        grader_id UUID REFERENCES users(id),
        is_late BOOLEAN DEFAULT false
      );
    `);
    console.log("✓ Created submissions table");

    console.log("\n✓ All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

createTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
