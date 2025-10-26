#!/bin/bash
set -e

# Read DATABASE_URL from .env.local
source <(grep "^DATABASE_URL=" .env.local)

if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

# Add missing columns
psql "$DATABASE_URL" << 'EOF'
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    BEGIN
        ALTER TABLE courses ADD COLUMN credits integer DEFAULT 3;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN semester text;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN academic_year text;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN schedule text;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN classroom text;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN syllabus_url text;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN updated_at timestamp with time zone DEFAULT current_timestamp;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;

    BEGIN
        ALTER TABLE courses ADD COLUMN is_active boolean DEFAULT true;
    EXCEPTION 
        WHEN duplicate_column THEN 
        NULL;
    END;
END $$;

-- Verify the columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY column_name;
EOF