-- Add programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  total_units INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  units TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add curriculum table
CREATE TABLE IF NOT EXISTS curriculum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  year_level TEXT NOT NULL,
  semester TEXT NOT NULL,
  is_elective BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add program_id and year_level to users table (if not exists)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES programs(id),
ADD COLUMN IF NOT EXISTS year_level TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_curriculum_program ON curriculum(program_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_subject ON curriculum(subject_id);
CREATE INDEX IF NOT EXISTS idx_users_program ON users(program_id);
