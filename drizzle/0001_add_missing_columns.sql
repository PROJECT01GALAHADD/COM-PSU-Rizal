ALTER TABLE messages RENAME TO chat_messages;

ALTER TABLE courses 
  ADD credits integer DEFAULT 3,
  ADD semester text,
  ADD academic_year text,
  ADD schedule text,
  ADD classroom text,
  ADD syllabus_url text,
  ADD updated_at timestamp DEFAULT current_timestamp,
  ADD is_active boolean DEFAULT true;