import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Programs table - bachelor degree programs
export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  totalUnits: integer("total_units"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subjects table - all subjects/courses
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  units: text("units").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Curriculum table - links programs to subjects with year/semester
export const curriculum = pgTable("curriculum", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => programs.id),
  subjectId: uuid("subject_id").notNull().references(() => subjects.id),
  yearLevel: text("year_level").notNull(),
  semester: text("semester").notNull(),
  isElective: boolean("is_elective").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table - for all user types (students, faculty, admin)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["student", "faculty", "admin", "guest"] }).notNull(),
  fullName: text("full_name").notNull(),
  programId: uuid("program_id").references(() => programs.id),
  yearLevel: text("year_level"),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Meetings table
export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  hostId: uuid("host_id").notNull().references(() => users.id),
  scheduledStartTime: timestamp("scheduled_start_time"),
  actualStartTime: timestamp("actual_start_time"),
  endTime: timestamp("end_time"),
  isPublic: boolean("is_public").default(false),
  maxParticipants: integer("max_participants").default(50),
  meetingType: text("meeting_type", { enum: ["lecture", "group_discussion", "office_hours", "exam", "other"] }).default("other"),
  courseId: uuid("course_id").references(() => courses.id),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

// Participants table
export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").notNull().references(() => meetings.id),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"), // For guests who don't have accounts
  isHost: boolean("is_host").default(false),
  isMuted: boolean("is_muted").default(false),
  isCameraOff: boolean("is_camera_off").default(false),
  isScreenSharing: boolean("is_screen_sharing").default(false),
  joinTime: timestamp("join_time").defaultNow(),
  leaveTime: timestamp("leave_time"),
  role: text("role", { enum: ["host", "cohost", "participant", "guest"] }).default("participant"),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").notNull().references(() => meetings.id),
  participantId: uuid("participant_id").notNull().references(() => participants.id),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false),
});

// Courses table
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  facultyId: uuid("faculty_id").references(() => users.id),
  semester: text("semester"),
  academicYear: text("academic_year"),
  credits: integer("credits").default(3),
  schedule: text("schedule"),
  classroom: text("classroom"),
  syllabusUrl: text("syllabus_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull().references(() => users.id),
  courseId: uuid("course_id").notNull().references(() => courses.id),
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  status: text("status", { enum: ["enrolled", "dropped", "completed"] }).default("enrolled"),
  grade: text("grade"),
  finalGrade: text("final_grade"),
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").notNull().references(() => assignments.id),
  studentId: uuid("student_id").notNull().references(() => users.id),
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  content: text("content"),
  attachmentUrl: text("attachment_url"),
  pointsAwarded: integer("points_awarded"),
  feedback: text("feedback"),
  gradedDate: timestamp("graded_date"),
  graderId: uuid("grader_id").references(() => users.id),
  isLate: boolean("is_late").default(false),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").notNull().references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  priority: text("priority", { enum: ["low", "normal", "high", "urgent"] }).default("normal"),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const programsRelations = relations(programs, ({ many }) => ({
  students: many(users),
  curriculum: many(curriculum),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  curriculum: many(curriculum),
}));

export const curriculumRelations = relations(curriculum, ({ one }) => ({
  program: one(programs, {
    fields: [curriculum.programId],
    references: [programs.id],
  }),
  subject: one(subjects, {
    fields: [curriculum.subjectId],
    references: [subjects.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  program: one(programs, {
    fields: [users.programId],
    references: [programs.id],
  }),
  hostedMeetings: many(meetings),
  participations: many(participants),
  courses: many(courses),
  enrollments: many(enrollments),
  submissions: many(submissions),
  gradedSubmissions: many(submissions, { relationName: "grader" }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  host: one(users, {
    fields: [meetings.hostId],
    references: [users.id],
  }),
  participants: many(participants),
  chatMessages: many(chatMessages),
  course: one(courses, {
    fields: [meetings.courseId],
    references: [courses.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one, many }) => ({
  meeting: one(meetings, {
    fields: [participants.meetingId],
    references: [meetings.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  meeting: one(meetings, {
    fields: [chatMessages.meetingId],
    references: [meetings.id],
  }),
  participant: one(participants, {
    fields: [chatMessages.participantId],
    references: [participants.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  faculty: one(users, {
    fields: [courses.facultyId],
    references: [users.id],
  }),
  meetings: many(meetings),
  enrollments: many(enrollments),
  assignments: many(assignments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
    relationName: "student",
  }),
  grader: one(users, {
    fields: [submissions.graderId],
    references: [users.id],
    relationName: "grader",
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [announcements.courseId],
    references: [courses.id],
  }),
}));