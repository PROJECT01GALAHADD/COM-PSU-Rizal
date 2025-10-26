import postgres from "postgres";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  console.log("🌱 Seeding Replit PostgreSQL database...\n");
  
  // Build connection string from Replit PG variables
  const host = process.env.PGHOST!;
  const port = process.env.PGPORT || '5432';
  const user = process.env.PGUSER!;
  const password = process.env.PGPASSWORD!;
  const database = process.env.PGDATABASE!;
  
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  const sql = postgres(connectionString, { max: 1 });
  
  try {
    // Hash passwords
    const adminPass = await bcrypt.hash("admin123", 10);
    const facultyPass = await bcrypt.hash("faculty123", 10);
    const studentPass = await bcrypt.hash("student123", 10);
    
    // 1. Create Admin User
    console.log("👤 Creating admin user...");
    const [admin] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('admin@psu.palawan.edu.ph', ${adminPass}, 'admin', 'System Administrator')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Admin: ${admin.email}`);
    
    // 2. Create Faculty Users
    console.log("\n👨‍🏫 Creating faculty users...");
    const [faculty1] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('prof.cruz@psu.palawan.edu.ph', ${facultyPass}, 'faculty', 'Prof. Maria Cruz')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Faculty: ${faculty1.email}`);
    
    const [faculty2] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('prof.santos@psu.palawan.edu.ph', ${facultyPass}, 'faculty', 'Prof. Juan Santos')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Faculty: ${faculty2.email}`);
    
    // 3. Create Student Users (Demo accounts)
    console.log("\n🎓 Creating student users (demo accounts)...");
    const [student1] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('juan.delacruz@student.psu.edu.ph', ${studentPass}, 'student', 'Juan Dela Cruz')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Student: ${student1.email}`);
    
    const [student2] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('maria.santos@student.psu.edu.ph', ${studentPass}, 'student', 'Maria Santos')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Student: ${student2.email}`);
    
    const [student3] = await sql`
      INSERT INTO users (email, password_hash, role, full_name)
      VALUES ('pedro.reyes@student.psu.edu.ph', ${studentPass}, 'student', 'Pedro Reyes')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id, email
    `;
    console.log(`✓ Student: ${student3.email}`);
    
    // 4. Create Sample Courses
    console.log("\n📚 Creating sample courses...");
    const [course1] = await sql`
      INSERT INTO courses (code, title, description, faculty_id, semester, academic_year, credits, schedule, classroom, is_active)
      VALUES (
        'CS101',
        'Introduction to Computer Science',
        'Fundamentals of programming and computer science concepts',
        ${faculty1.id},
        'First Semester',
        '2024-2025',
        3,
        'MWF 9:00-10:00 AM',
        'Room 301',
        true
      )
      ON CONFLICT (code) DO UPDATE SET updated_at = NOW()
      RETURNING id, code, title
    `;
    console.log(`✓ Course: ${course1.code} - ${course1.title}`);
    
    const [course2] = await sql`
      INSERT INTO courses (code, title, description, faculty_id, semester, academic_year, credits, schedule, classroom, is_active)
      VALUES (
        'CS201',
        'Data Structures and Algorithms',
        'Advanced programming concepts, data structures, and algorithm design',
        ${faculty1.id},
        'First Semester',
        '2024-2025',
        3,
        'TTH 1:00-2:30 PM',
        'Room 302',
        true
      )
      ON CONFLICT (code) DO UPDATE SET updated_at = NOW()
      RETURNING id, code, title
    `;
    console.log(`✓ Course: ${course2.code} - ${course2.title}`);
    
    const [course3] = await sql`
      INSERT INTO courses (code, title, description, faculty_id, semester, academic_year, credits, schedule, classroom, is_active)
      VALUES (
        'MATH101',
        'Calculus I',
        'Introduction to differential and integral calculus',
        ${faculty2.id},
        'First Semester',
        '2024-2025',
        3,
        'MWF 10:30-11:30 AM',
        'Room 201',
        true
      )
      ON CONFLICT (code) DO UPDATE SET updated_at = NOW()
      RETURNING id, code, title
    `;
    console.log(`✓ Course: ${course3.code} - ${course3.title}`);
    
    // 5. Enroll Students in Courses
    console.log("\n📝 Enrolling students in courses...");
    await sql`
      INSERT INTO enrollments (student_id, course_id, status)
      VALUES 
        (${student1.id}, ${course1.id}, 'enrolled'),
        (${student1.id}, ${course2.id}, 'enrolled'),
        (${student2.id}, ${course1.id}, 'enrolled'),
        (${student2.id}, ${course3.id}, 'enrolled'),
        (${student3.id}, ${course2.id}, 'enrolled'),
        (${student3.id}, ${course3.id}, 'enrolled')
      ON CONFLICT DO NOTHING
    `;
    console.log("✓ 6 enrollments created");
    
    // 6. Create Sample Assignments
    console.log("\n📋 Creating sample assignments...");
    const dueDate1 = new Date();
    dueDate1.setDate(dueDate1.getDate() + 7); // Due in 7 days
    
    const dueDate2 = new Date();
    dueDate2.setDate(dueDate2.getDate() + 14); // Due in 14 days
    
    await sql`
      INSERT INTO assignments (course_id, title, description, due_date, max_points)
      VALUES 
        (
          ${course1.id},
          'Programming Assignment 1',
          'Write a program to implement basic sorting algorithms',
          ${dueDate1.toISOString()},
          100
        ),
        (
          ${course1.id},
          'Programming Assignment 2',
          'Create a simple calculator application',
          ${dueDate2.toISOString()},
          100
        ),
        (
          ${course2.id},
          'Data Structures Project',
          'Implement a binary search tree with insert, delete, and search operations',
          ${dueDate1.toISOString()},
          150
        )
      ON CONFLICT DO NOTHING
    `;
    console.log("✓ 3 assignments created");
    
    // 7. Create Sample Announcement
    console.log("\n📢 Creating sample announcements...");
    await sql`
      INSERT INTO announcements (title, content, author_id, course_id, priority, is_pinned)
      VALUES 
        (
          'Welcome to PSU Rizal!',
          'Welcome to the Academic Collaboration Platform. This is your hub for virtual learning, assignments, and real-time meetings.',
          ${admin.id},
          NULL,
          'high',
          true
        ),
        (
          'CS101 First Meeting',
          'Our first online meeting will be held this Friday at 9:00 AM. Please join using the meeting link in your dashboard.',
          ${faculty1.id},
          ${course1.id},
          'normal',
          false
        )
      ON CONFLICT DO NOTHING
    `;
    console.log("✓ 2 announcements created");
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Database seeding completed successfully!");
    console.log("=".repeat(50));
    console.log("\n📋 Demo Login Credentials:");
    console.log("\n👤 Admin:");
    console.log("   Email: admin@psu.palawan.edu.ph");
    console.log("   Password: admin123");
    console.log("\n👨‍🏫 Faculty:");
    console.log("   Email: prof.cruz@psu.palawan.edu.ph");
    console.log("   Password: faculty123");
    console.log("\n🎓 Students:");
    console.log("   Email: juan.delacruz@student.psu.edu.ph");
    console.log("   Password: student123");
    console.log("\n" + "=".repeat(50));
    
    await sql.end();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await sql.end();
    throw error;
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
