-- Add missing columns to courses table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'credits') THEN
        ALTER TABLE courses ADD COLUMN credits INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'semester') THEN
        ALTER TABLE courses ADD COLUMN semester VARCHAR;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'description') THEN
        ALTER TABLE courses ADD COLUMN description TEXT;
    END IF;
END $$;