"use client";

export type UserRole = "student" | "faculty" | "admin";

export type DemoUser = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    password: string;
};

export type Student = { 
    id: string; 
    name: string; 
    email: string;
    course?: string;
    year?: number;
    section?: string;
    status?: "regular" | "irregular";
    enrollmentDate?: string;
};

export type Instructor = { 
    id: string; 
    name: string; 
    email: string;
    department?: string;
    position?: string;
    specialization?: string;
    officeHours?: string;
    status?: "full-time" | "part-time";
};

export type CurriculumItem = { 
    id: string; 
    code: string; 
    title: string;
    description?: string;
    units?: number;
    prerequisites?: string[];
    department?: string;
    semester?: "1st" | "2nd" | "summer";
    yearLevel?: number;
};

export type Announcement = {
    id: string;
    id_: string;
    title: string;
    body: string;
    date: string;
    author?: string;
    department?: string;
    priority?: "low" | "medium" | "high";
    tags?: string[];
    attachments?: string[];
};

export type Grade = {
    id: string;
    studentId: string;
    courseId: string;
    grade: number;
    term: string;
    academicYear: string;
    status?: "passed" | "failed" | "incomplete";
    remarks?: string;
};

export type Assignment = {
    id: string;
    courseId: string;
    title: string;
    description: string;
    dueDate: string;
    points: number;
    type?: "quiz" | "homework" | "project" | "exam";
    status?: "draft" | "published" | "closed";
    submissions?: number;
};

export type DashboardStats = {
    totalStudents: number;
    totalFaculty: number;
    totalCourses: number;
    activeEnrollments: number;
    averageGrade: number;
    completionRate: number;
    studentsByYear: { year: number; count: number }[];
    gradeDistribution: { grade: string; count: number }[];
    departmentStats: { name: string; students: number; faculty: number }[];
    recentActivities: {
        id: string;
        type: "enrollment" | "grade" | "announcement" | "assignment";
        description: string;
        date: string;
    }[];
};

const STORAGE_KEY = "com_mock_data_v1";
const AUTH_KEY = "com_demo_auth_v1";
const STATS_KEY = "com_demo_stats_v1";

function readStore() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function writeStore(payload: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function ensureStore() {
    const s = readStore();
    if (s) return s;
    const initial = {
        users: [
            { 
                id: "demo-admin",
                email: "admin@demo.psu.edu.ph",
                name: "Demo Admin",
                role: "admin",
                password: "demo123"
            },
            {
                id: "demo-faculty",
                email: "faculty@demo.psu.edu.ph",
                name: "Demo Faculty",
                role: "faculty",
                password: "demo123"
            },
            {
                id: "demo-student",
                email: "student@demo.psu.edu.ph",
                name: "Demo Student",
                role: "student",
                password: "demo123"
            }
        ],
        students: [
            { 
                id: "s1", 
                name: "Juan Dela Cruz", 
                email: "juan@psu.edu.ph",
                course: "BS Computer Science",
                year: 3,
                section: "A",
                status: "regular",
                enrollmentDate: "2021-08-15"
            },
            { 
                id: "s2", 
                name: "Maria Santos", 
                email: "maria@psu.edu.ph",
                course: "BS Information Technology",
                year: 2,
                section: "B",
                status: "regular",
                enrollmentDate: "2022-08-15"
            },
            { 
                id: "s3", 
                name: "Pedro Reyes", 
                email: "pedro@psu.edu.ph",
                course: "BS Computer Science",
                year: 4,
                section: "A",
                status: "irregular",
                enrollmentDate: "2020-08-15"
            }
        ],
        instructors: [
            { 
                id: "i1", 
                name: "Dr. Santos", 
                email: "santos@psu.edu.ph",
                department: "Computer Science",
                position: "Professor",
                specialization: "Data Science",
                officeHours: "MWF 10:00-12:00",
                status: "full-time"
            },
            { 
                id: "i2", 
                name: "Prof. Garcia", 
                email: "garcia@psu.edu.ph",
                department: "Information Technology",
                position: "Assistant Professor",
                specialization: "Web Development",
                officeHours: "TTH 13:00-15:00",
                status: "full-time"
            },
            { 
                id: "i3", 
                name: "Dr. Reyes", 
                email: "reyes@psu.edu.ph",
                department: "Computer Science",
                position: "Associate Professor",
                specialization: "Artificial Intelligence",
                officeHours: "MWF 14:00-16:00",
                status: "full-time"
            }
        ],
        curriculum: [
            { 
                id: "c1", 
                code: "CS101", 
                title: "Introduction to Programming",
                description: "Basic concepts of programming using Python",
                units: 3,
                prerequisites: [],
                department: "Computer Science",
                semester: "1st",
                yearLevel: 1
            },
            {
                id: "c2",
                code: "CS102",
                title: "Data Structures and Algorithms",
                description: "Fundamental data structures and algorithms",
                units: 3,
                prerequisites: ["CS101"],
                department: "Computer Science",
                semester: "2nd",
                yearLevel: 1
            },
            {
                id: "c3",
                code: "CS103",
                title: "Web Development",
                description: "Building modern web applications",
                units: 3,
                prerequisites: ["CS101"],
                department: "Computer Science",
                semester: "1st",
                yearLevel: 2
            }
        ],
        announcements: [
            {
                id: "a1",
                id_: "a1",
                title: "Welcome to the New Semester",
                body: "Welcome to the Fall 2024 semester at PSU Rizal!",
                date: new Date().toISOString(),
                author: "Dr. Santos",
                department: "Computer Science",
                priority: "high",
                tags: ["general", "welcome"],
                attachments: ["welcome-guide.pdf"]
            },
            {
                id: "a2",
                id_: "a2",
                title: "Midterm Schedule Posted",
                body: "The midterm examination schedule has been posted.",
                date: new Date().toISOString(),
                author: "Prof. Garcia",
                department: "Computer Science",
                priority: "medium",
                tags: ["exams", "schedule"],
                attachments: ["midterm-schedule.pdf"]
            }
        ],
        grades: [
            {
                id: "g1",
                studentId: "s1",
                courseId: "c1",
                grade: 85,
                term: "1st",
                academicYear: "2023-2024",
                status: "passed",
                remarks: "Good performance"
            },
            {
                id: "g2",
                studentId: "s1",
                courseId: "c2",
                grade: 88,
                term: "1st",
                academicYear: "2023-2024",
                status: "passed",
                remarks: "Excellent work"
            }
        ],
        assignments: [
            {
                id: "as1",
                courseId: "c1",
                title: "Python Basics Exercise",
                description: "Complete the exercises on Python fundamentals",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                points: 100,
                type: "homework",
                status: "published",
                submissions: 15
            },
            {
                id: "as2",
                courseId: "c2",
                title: "Linked List Implementation",
                description: "Implement a doubly linked list in Python",
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                points: 100,
                type: "project",
                status: "published",
                submissions: 12
            }
        ],
        dashboardStats: {
            totalStudents: 450,
            totalFaculty: 32,
            totalCourses: 48,
            activeEnrollments: 425,
            averageGrade: 85.5,
            completionRate: 92.5,
            studentsByYear: [
                { year: 1, count: 120 },
                { year: 2, count: 115 },
                { year: 3, count: 110 },
                { year: 4, count: 105 }
            ],
            gradeDistribution: [
                { grade: "A", count: 150 },
                { grade: "B", count: 200 },
                { grade: "C", count: 75 },
                { grade: "D", count: 20 },
                { grade: "F", count: 5 }
            ],
            departmentStats: [
                { name: "Computer Science", students: 200, faculty: 15 },
                { name: "Information Technology", students: 180, faculty: 12 },
                { name: "Information Systems", students: 70, faculty: 5 }
            ],
            recentActivities: [
                {
                    id: "ra1",
                    type: "enrollment",
                    description: "New student enrolled in BS Computer Science",
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "ra2",
                    type: "grade",
                    description: "Midterm grades posted for CS101",
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "ra3",
                    type: "announcement",
                    description: "New department announcement posted",
                    date: new Date().toISOString()
                }
            ]
        }
    };
    writeStore(initial);
    return initial;
}

// Demo Auth Functions
export function getDemoUsers(): DemoUser[] {
    const s = ensureStore();
    return s.users;
}

export function demoLogin(email: string, password: string): DemoUser | null {
    const users = getDemoUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        try {
            const cookiePayload = encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
            document.cookie = `demo_mode=true; path=/`; // simple flag cookie
            document.cookie = `demo_auth=${cookiePayload}; path=/`; // encoded user info
        } catch {}
        return user;
    }
    return null;
}

export function demoLogout() {
    localStorage.removeItem(AUTH_KEY);
    try {
        // Expire cookies
        document.cookie = `demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch {}
}

export function getCurrentDemoUser(): DemoUser | null {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isDemoMode(): boolean {
    return getCurrentDemoUser() !== null;
}

// Data Access Functions
export function getStudents(): Student[] {
    const s = ensureStore();
    return s.students;
}

export function addStudent(student: Student) {
    const s = ensureStore();
    s.students.push(student);
    writeStore(s);
}

export function removeStudent(id: string) {
    const s = ensureStore();
    s.students = s.students.filter((x: any) => x.id !== id);
    writeStore(s);
}

export function getInstructors(): Instructor[] {
    const s = ensureStore();
    return s.instructors;
}

export function addInstructor(ins: Instructor) {
    const s = ensureStore();
    s.instructors.push(ins);
    writeStore(s);
}

export function getCurriculum(): CurriculumItem[] {
    const s = ensureStore();
    return s.curriculum;
}

export function addCurriculumItem(item: CurriculumItem) {
    const s = ensureStore();
    s.curriculum.push(item);
    writeStore(s);
}

export function getAnnouncements(): Announcement[] {
    const s = ensureStore();
    return s.announcements;
}

export function addAnnouncement(a: Announcement) {
    const s = ensureStore();
    s.announcements.push(a);
    writeStore(s);
}

export function getGrades(studentId?: string): Grade[] {
    const s = ensureStore();
    if (studentId) {
        return s.grades.filter((g: Grade) => g.studentId === studentId);
    }
    return s.grades;
}

export function addGrade(grade: Grade) {
    const s = ensureStore();
    s.grades.push(grade);
    writeStore(s);
}

export function getAssignments(courseId?: string): Assignment[] {
    const s = ensureStore();
    if (courseId) {
        return s.assignments.filter((a: Assignment) => a.courseId === courseId);
    }
    return s.assignments;
}

export function addAssignment(assignment: Assignment) {
    const s = ensureStore();
    s.assignments.push(assignment);
    writeStore(s);
}

export function getDashboardStats(): DashboardStats {
    const s = ensureStore();
    return s.dashboardStats;
}
