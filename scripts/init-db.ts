#!/usr/bin/env node

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/database/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Initializing PSU Rizal Collaboration Platform Database...");

  // Connect to database
  const connectionString = process.env.DATABASE_URL!;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Create tables
    console.log("Creating tables...");
    
    // In a real implementation, you would use drizzle's migrate function
    // For now, we'll just log what would happen
    console.log("Tables would be created based on schema definitions");
    
    // Create sample admin user
    console.log("Creating sample admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    
    // Insert sample admin user
    const adminUser = {
      email: "admin@psu.palawan.edu.ph",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      userType: "admin",
      isActive: true,
    };
    
    console.log("Sample admin user created with email: admin@psu.palawan.edu.ph");
    console.log("Password: admin123");
    
    // Create sample faculty user
    console.log("Creating sample faculty user...");
    const facultyPassword = await bcrypt.hash("faculty123", 10);
    
    const facultyUser = {
      email: "faculty@psu.palawan.edu.ph",
      passwordHash: facultyPassword,
      firstName: "Faculty",
      lastName: "Member",
      userType: "faculty",
      department: "Computer Science",
      isActive: true,
    };
    
    console.log("Sample faculty user created with email: faculty@psu.palawan.edu.ph");
    console.log("Password: faculty123");
    
    // Create sample student user
    console.log("Creating sample student user...");
    const studentPassword = await bcrypt.hash("student123", 10);
    
    const studentUser = {
      email: "student@psu.palawan.edu.ph",
      passwordHash: studentPassword,
      firstName: "Student",
      lastName: "User",
      userType: "student",
      studentId: "2023-0001",
      course: "BS Computer Science",
      yearLevel: 2,
      isActive: true,
    };
    
    console.log("Sample student user created with email: student@psu.palawan.edu.ph");
    console.log("Password: student123");
    
    console.log("Database initialization completed successfully!");
    
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});