-- Create tables for initial app use with UUIDs
-- This file is placed in docker-entrypoint-initdb.d so Postgres will run it on first init

-- Create enum type for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM('admin', 'faculty', 'student', 'guest');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table with UUIDs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role user_role DEFAULT 'student' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Seed users
INSERT INTO users (email, role, password_hash)
SELECT 'admin@psu.edu', 'admin', NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='admin@psu.edu');

INSERT INTO users (email, role, password_hash)
SELECT 'teacher1@psu.edu', 'faculty', NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='teacher1@psu.edu');

INSERT INTO users (email, role, password_hash)
SELECT 'student1@psu.edu', 'student', NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='student1@psu.edu');

-- End of seed.sql
