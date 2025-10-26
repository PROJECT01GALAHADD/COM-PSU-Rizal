-- Idempotent base schema setup for PSU local
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Roles enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin','faculty','student');
  END IF;
END$$;

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Faculty profile
CREATE TABLE IF NOT EXISTS public.faculty (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  department TEXT,
  title TEXT,
  hired_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student profile
CREATE TABLE IF NOT EXISTS public.students (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  student_no TEXT UNIQUE,
  course TEXT,
  year_level INT,
  enrolled_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Simple trigger to update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at'
  ) THEN
    CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'faculty_set_updated_at'
  ) THEN
    CREATE TRIGGER faculty_set_updated_at BEFORE UPDATE ON public.faculty
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'students_set_updated_at'
  ) THEN
    CREATE TRIGGER students_set_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

-- Seed default admin if not exists
INSERT INTO public.users (email, password_hash, role, full_name)
SELECT 'admin@local', 'admin123', 'admin', 'Local Administrator'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'admin@local'
);

-- Seed default faculty
WITH ins AS (
  INSERT INTO public.users (email, password_hash, role, full_name)
  SELECT 'faculty@local', 'faculty123', 'faculty', 'Default Faculty'
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'faculty@local')
  RETURNING id
)
INSERT INTO public.faculty (user_id, department, title, hired_at)
SELECT u.id, 'Computer Science', 'Instructor', CURRENT_DATE
FROM (
  SELECT id FROM ins
  UNION ALL
  SELECT id FROM public.users WHERE email = 'faculty@local'
) AS u
WHERE NOT EXISTS (
  SELECT 1 FROM public.faculty f WHERE f.user_id = u.id
);

-- Seed default student
WITH ins AS (
  INSERT INTO public.users (email, password_hash, role, full_name)
  SELECT 'student@local', 'student123', 'student', 'Default Student'
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student@local')
  RETURNING id
)
INSERT INTO public.students (user_id, student_no, course, year_level, enrolled_at)
SELECT u.id, 'S-0001', 'BSCS', 1, CURRENT_DATE
FROM (
  SELECT id FROM ins
  UNION ALL
  SELECT id FROM public.users WHERE email = 'student@local'
) AS u
WHERE NOT EXISTS (
  SELECT 1 FROM public.students s WHERE s.user_id = u.id
);
