import type { User } from "@/redux/features/authApiSlice";


export interface Profile {
    user: User,
    avatar: string | null,
    bio: string | null,
}

export interface Student {
    user: User,
    level: {
        level: number,
        min_xp: number,
        max_xp: number | null,
    },
    xp: number,
}

export interface Parent {
    user: User,
    children: Student[],
}

export interface Teacher {
    user: User,
    specialty: string | null;
    level: string | null
}

export type user = Student | Parent | Teacher | User;

export interface Quiz {
    id: number;
    title: string;
    description: string | null;
    course: number | Course;
    min_score_to_pass: number;
    duration: number | null; // in minutes
    questions: Question[] | number[] | null;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: number;
    quiz: number;
    text: string;
    type: "multiple_choice" | "true_false" | "essay";
    points: number;
    answers: Answer[] | null;
}

export interface Answer {
    id: number;
    question: number;
    text: string;
    is_correct: boolean;
}

export interface Course {
    id: number;
    title: string;
    syllabus: string | null;
    description: string;
    created_by: number;
    min_level_required: number;
    created_from_request: number | null;
    credits: number;
    students: Student[] | number[] | null;
    matter: string;
    start_date: string;
    end_date: string;
    creeated_at: string;
    updated_at: string;

}

export interface CourseProgress {
    id: number;
    course: Course;
    progress_percentage: number;
    last_accessed: string;
    completion_status: boolean;
    student: number
    quizzes: number[];
}


export interface userType {
    id: number;
    nickname: string;
    email: string;
    last_login?: string;

}

export interface conversationtype {
    id: string;
    users: User[];
}

export interface instantMessageType {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: User;
    author: User;
}

export interface messageType {
    id: string;
    conversation: string;
    body: string;
    sent_to: User;
    author: User;
    created: string;
}