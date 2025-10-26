import { db, schema } from "@/lib/database/connection";
import { eq } from "drizzle-orm";

// Utility functions for common database operations

export async function getUserByEmail(email: string) {
  const users = await db.select().from(schema.users).where(
    eq(schema.users.email, email)
  );
  return users[0] || null;
}

export async function getUserById(id: string) {
  const users = await db.select().from(schema.users).where(
    eq(schema.users.id, id)
  );
  return users[0] || null;
}

export async function getMeetingById(id: string) {
  const meetings = await db.select().from(schema.meetings).where(
    eq(schema.meetings.id, id)
  );
  return meetings[0] || null;
}

export async function getParticipantById(id: string) {
  const participants = await db.select().from(schema.participants).where(
    eq(schema.participants.id, id)
  );
  return participants[0] || null;
}

export async function getCourseById(id: string) {
  const courses = await db.select().from(schema.courses).where(
    eq(schema.courses.id, id)
  );
  return courses[0] || null;
}

export async function getUserCourses(userId: string) {
  // For students
  const studentEnrollments = await db.select({
    course: schema.courses,
    enrollment: schema.enrollments
  }).from(schema.enrollments)
  .innerJoin(schema.courses, eq(schema.courses.id, schema.enrollments.courseId))
  .where(eq(schema.enrollments.studentId, userId));

  // For faculty
  const facultyCourses = await db.select().from(schema.courses).where(
    eq(schema.courses.facultyId, userId)
  );

  return {
    enrolled: studentEnrollments.map(e => e.course),
    teaching: facultyCourses
  };
}

export async function getMeetingParticipants(meetingId: string) {
  return await db.select({
    participant: schema.participants,
    user: schema.users
  }).from(schema.participants)
  .leftJoin(schema.users, eq(schema.users.id, schema.participants.userId))
  .where(eq(schema.participants.meetingId, meetingId));
}

export async function getMeetingChatMessages(meetingId: string) {
  return await db.select({
    message: schema.chatMessages,
    participant: schema.participants
  }).from(schema.chatMessages)
  .innerJoin(schema.participants, eq(schema.participants.id, schema.chatMessages.participantId))
  .where(eq(schema.chatMessages.meetingId, meetingId))
  .orderBy(schema.chatMessages.timestamp);
}