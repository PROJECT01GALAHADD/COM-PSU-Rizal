CREATE TABLE IF NOT EXISTS "courses_new" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"faculty_id" uuid,
	"credits" integer DEFAULT 3,
	"semester" text,
	"academic_year" text,
	"schedule" text,
	"classroom" text,
	"syllabus_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "courses_code_unique" UNIQUE("code")
);

-- Copy data from old table to new table
INSERT INTO "courses_new" (
	"id", 
	"code", 
	"title", 
	"description", 
	"faculty_id", 
	"created_at"
)
SELECT 
	"id", 
	"code", 
	"title", 
	"description", 
	"faculty_id", 
	"created_at"
FROM "courses";

-- Drop old table and rename new table
DROP TABLE "courses";
ALTER TABLE "courses_new" RENAME TO "courses";