DROP FUNCTION IF EXISTS add_missing_columns();

CREATE OR REPLACE FUNCTION add_missing_columns()
RETURNS void AS $$
BEGIN
  -- Add missing columns if they don't exist
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'credits';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN credits integer DEFAULT 3;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'semester';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN semester text;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'academic_year';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN academic_year text;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'schedule';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN schedule text;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'classroom';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN classroom text;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'syllabus_url';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN syllabus_url text;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'updated_at';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN updated_at timestamp with time zone DEFAULT current_timestamp;
  END IF;
  
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_name = 'courses' AND column_name = 'is_active';
  
  IF NOT FOUND THEN
    ALTER TABLE courses ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END;
$$ LANGUAGE plpgsql;