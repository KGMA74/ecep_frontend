// components/student/Dashboard.tsx
"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Book, Star, Clock } from "lucide-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import api from "@/utils/api";
import { CourseProgress } from "@/utils/type";

// Définir les interfaces pour le typage
interface Badge {
    id: number;
    name: string;
    icon: string;
    date: string;
}

interface Coursed {
    id: number;
    title: string;
    subject: string;
    progress?: number;
}

interface StudentData {
    name: string;
    level: number;
    xp: number;
    totalXp: number;
    badges: Badge[];
    recentCourses: Coursed[];
    recommendedCourses: Coursed[];
}

interface StudentDashboardProps {
    student?: StudentData;
}

const StudentDashboard = () => {
    const { data: me, isLoading } = useRetrieveUserQuery();
    const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([]);
    const [matters, setMatters] = useState<string[]>([]);

    const fetchCourses = async () => {
        await api
            .get(`course-progress/user_progress/`)
            .json<CourseProgress[]>()
            .then((resp) => setCoursesProgress(resp))
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        if (!isLoading) fetchCourses();
    }, [me]);

    // Données fictives pour la démonstration
    // const studentData: StudentData = student || {
    const studentData: StudentData = {
        name: "Sarah Dupont",
        level: 8,
        xp: 750,
        totalXp: 1000,
        badges: [
            { id: 1, name: "Super Lecteur", icon: "📚", date: "2025-03-01" },
            { id: 2, name: "Mathématicien", icon: "🔢", date: "2025-02-28" },
            { id: 3, name: "Historien", icon: "🏛️", date: "2025-02-25" },
        ],
        recentCourses: [
        ],
        recommendedCourses: [
            {
                id: 4,
                title: "Les figures géométriques",
                subject: "Mathématiques",
            },
            { id: 5, title: "La poésie", subject: "Français" },
        ],
    };

    // Calculer le pourcentage de XP
    const xpPercentage =
        (100 * ((me?.student?.xp ?? 0) - (me?.student?.level.min_xp ?? 0))) /
        ((me?.student?.level.max_xp ?? 1) - (me?.student?.level.min_xp ?? 0));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* En-tête avec informations principales */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Bonjour, {me?.firstname} {me?.lastname}👋
                    </h1>
                    <p className="text-gray-500">
                        Continue ton apprentissage aujourd'hui !
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg w-full md:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white p-2 rounded-full">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Niveau {me?.student?.level.level }
                            </p>
                            <div className="w-full md:w-48 mt-1">
                                <Progress
                                    value={xpPercentage}
                                    className="h-2"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {me?.student?.xp} / {me?.student?.level.max_xp}{" "}
                                XP
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grille principale du tableau de bord */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Carte des badges récents */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                            <Star className="text-yellow-500" size={18} />
                            Mes badges récents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {studentData.badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <div className="text-2xl">{badge.icon}</div>
                                    <div>
                                        <p className="font-medium">
                                            {badge.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Obtenu le{" "}
                                            {new Date(
                                                badge.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Link
                                href="/student/badges"
                                className="text-sm text-blue-500 hover:underline block mt-3"
                            >
                                Voir tous mes badges →
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Carte des cours récents */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                            <Book className="text-blue-500" size={18} />
                            Mes cours récents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                         
                            {coursesProgress
                                .slice(0, 3)
                                .map((courseProgress) => (
                                    <div
                                        key={courseProgress.course.id}
                                        className="space-y-1"
                                    >
                                        <div className="flex justify-between">
                                            <Link
                                                href={`/student/courses/${courseProgress.course.id}`}
                                                className="font-medium hover:text-blue-500"
                                            >
                                                {courseProgress.course.title}
                                            </Link>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {courseProgress.course.matter}
                                            </Badge>
                                        </div>

                                        <Progress
                                            value={
                                                courseProgress.progress_percentage
                                            }
                                            className="h-1.5"
                                        />
                                        <p className="text-xs text-gray-500 text-right">
                                            {courseProgress.progress_percentage}
                                            % terminé
                                        </p>
                                    </div>
                                ))}
                            <Link
                                href="/student/courses"
                                className="text-sm text-blue-500 hover:underline block mt-3"
                            >
                                Voir tous mes cours →
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Carte des recommandations */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                            <Clock className="text-green-500" size={18} />
                            Recommandations pour toi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {studentData.recommendedCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <Link
                                        href={`/student/courses/${course.id}`}
                                        className="block"
                                    >
                                        <p className="font-medium">
                                            {course.title}
                                        </p>
                                        <div className="flex justify-between items-center mt-1">
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {course.subject}
                                            </Badge>
                                            <span className="text-xs text-blue-500">
                                                Commencer →
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
