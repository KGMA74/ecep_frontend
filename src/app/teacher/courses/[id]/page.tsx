"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import type { Course, Student, Quiz } from "@/utils/type"; // Update your type.ts to include Quiz type
import { toast } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";
import formatDate from "@/utils/formatDate";

import {
    Users,
    Award,
    Clock,
    Calendar,
    Check,
    ArrowLeft,
    Edit,
    Trash2,
    PlusCircle,
    FileText,
    BarChart2,
    BookCheck,
    Timer,
    BookOpen,
    X,
} from "lucide-react";
import AddCourseForm from "@/components/form/AddCourseForm";

const CoursePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [showAddQuizModal, setShowAddQuizModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: "",
        duration: 30,
        course: id,
    });

    const handleUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        await api
            .patch(`courses/${course?.id}/`, {
                json: Object.fromEntries(formData),
            })
            .then((_) => {
                toast.success("cours mise a jour avec success");
            })
            .catch((_) =>
                toast.error("erreur survenu lors de la mise a jour du cours")
            );

        setOpenForm(false);
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const courseData = await api
                    .get(`courses/${id}/`)
                    .json<Course>();
                setCourse(courseData);

                // Fetch enrolled students data if available
                if (courseData.students && courseData.students.length > 0) {
                    try {
                        const studentsData = await api
                            .get(`courses/${id}/enrolled_students/`)
                            .json<Student[]>();
                            setStudents(studentsData);
                    } catch (error) {
                        console.error("Failed to fetch students:", error);
                    }
                }

                // Fetch quizzes for this course
                try {
                    const quizzesData = await api
                        .get(`quizzes/?course=${id}/`)
                        .json<Quiz[]>();
                    setQuizzes(quizzesData);
                } catch (error) {
                    console.error("Failed to fetch quizzes:", error);
                }
            } catch (error) {
                toast.error("Impossible de charger les détails du cours");
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseDetails();
        }
    }, [id]);

    const handleAddQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("quizzes/", { json: newQuiz }).json();
            toast.success("Quiz créé avec succès");
            setShowAddQuizModal(false);

            // Refresh quiz list
            const refreshedQuizzes = await api
                .get(
                    `quizzes/?course=${id}/
                /`
                )
                .json<Quiz[]>();
            setQuizzes(refreshedQuizzes);

            // Reset form
            setNewQuiz({
                title: "",
                duration: 30,
                course: id,
            });
        } catch (error) {
            toast.error("Échec de la création du quiz");
            console.error("Error creating quiz:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl mb-4">Cours non trouvé</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => router.push("/teacher/courses")}
                >
                    Retour aux cours
                </button>
            </div>
        );
    }

    // Components
    const Header = () => (
        <div className="max-w-6xl mx-auto mb-8">
            <button
                onClick={() => router.push("/teacher/courses")}
                className={`flex items-center gap-2 mb-6 ${
                    isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                }`}
            >
                <ArrowLeft size={20} />
                <span>Retour aux cours</span>
            </button>

            <div className="flex justify-between items-start">
                <h1
                    className={`text-3xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-800"
                    }`}
                >
                    {course.title}
                </h1>

                <div className="flex gap-2">
                    <button
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                            isDark
                                ? "bg-indigo-700 hover:bg-indigo-600"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white`}
                        onClick={_ => setOpenForm(true)}
                    >
                        <Edit size={18} />
                        <span>Modifier</span>
                    </button>

                    <button
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                            isDark
                                ? "bg-red-800 hover:bg-red-700"
                                : "bg-red-600 hover:bg-red-700"
                        } text-white`}
                        onClick={() => {
                            if (
                                confirm(
                                    "Êtes-vous sûr de vouloir supprimer ce cours ?"
                                )
                            ) {
                                api.delete(`courses/${id}/`)
                                    .then(() => {
                                        toast.success(
                                            "Cours supprimé avec succès"
                                        );
                                        router.push("/teacher/courses");
                                    })
                                    .catch(() =>
                                        toast.error(
                                            "Échec de la suppression du cours"
                                        )
                                    );
                            }
                        }}
                    >
                        <Trash2 size={18} />
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const CourseInfo = () => (
        <div
            className={`${
                isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}
        >
            <div className="flex items-center gap-2 mb-4">
                <div
                    className={`p-2 rounded-full ${
                        isDark
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                    }`}
                >
                    <BookOpen size={24} />
                </div>
                <h2 className="text-xl font-semibold">À propos du cours</h2>
            </div>

            <div
                className={`grid grid-cols-2 gap-4 mb-6 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                }`}
            >
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Matière
                    </p>
                    <p className="font-medium">{course.matter}</p>
                </div>
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Niveau minimum requis
                    </p>
                    <p className="font-medium">
                        {course.min_level_required || "Non spécifié"}
                    </p>
                </div>
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Date de début
                    </p>
                    <p className="font-medium flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(course.start_date)}
                    </p>
                </div>
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Date de fin
                    </p>
                    <p className="font-medium flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(course.end_date)}
                    </p>
                </div>
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Crédits
                    </p>
                    <p className="font-medium">{course.credits || 0}</p>
                </div>
                <div>
                    <p
                        className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                    >
                        Dernière mise à jour
                    </p>
                    <p className="font-medium">
                        {formatDate(course.updated_at)}
                    </p>
                </div>
            </div>

            <div>
                <h3
                    className={`font-semibold mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                    Description
                </h3>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {course.description}
                </p>
            </div>
        </div>
    );

    const QuizSection = () => (
        <div
            className={`${
                isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className={`p-2 rounded-full ${
                            isDark
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        <BookCheck size={24} />
                    </div>
                    <h2 className="text-xl font-semibold">Quiz du cours</h2>
                </div>

                <button
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                        isDark
                            ? "bg-yellow-700 hover:bg-yellow-600"
                            : "bg-yellow-600 hover:bg-yellow-700"
                    } text-white`}
                    onClick={() => setShowAddQuizModal(true)}
                >
                    <PlusCircle size={18} />
                    <span>Nouveau quiz</span>
                </button>
            </div>

            {quizzes.length > 0 ? (
                <div className="space-y-3">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className={`p-4 rounded-lg flex justify-between items-center ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-full ${
                                        isDark
                                            ? "bg-yellow-900 text-yellow-300"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    <BookCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {quiz.title}
                                    </h3>
                                    <p
                                        className={`flex items-center gap-1 text-sm ${
                                            isDark
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        <Timer size={14} />
                                        <span>{quiz.duration} minutes</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className={`p-2 rounded-lg ${
                                        isDark
                                            ? "hover:bg-gray-600"
                                            : "hover:bg-gray-200"
                                    }`}
                                    onClick={() =>
                                        router.push(
                                            `/teacher/quizzes/${quiz.id}/edit`
                                        )
                                    }
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className={`p-2 rounded-lg ${
                                        isDark
                                            ? "hover:bg-gray-600"
                                            : "hover:bg-gray-200"
                                    }`}
                                    onClick={() =>
                                        router.push(
                                            `/teacher/quizzes/${quiz.id}/questions`
                                        )
                                    }
                                >
                                    <FileText size={16} />
                                </button>
                                <button
                                    className={`p-2 rounded-lg ${
                                        isDark
                                            ? "hover:bg-gray-600"
                                            : "hover:bg-gray-200"
                                    }`}
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Êtes-vous sûr de vouloir supprimer ce quiz ?"
                                            )
                                        ) {
                                            api.delete(`quizzes/${quiz.id}/`)
                                                .then(() => {
                                                    toast.success(
                                                        "Quiz supprimé avec succès"
                                                    );
                                                    setQuizzes(
                                                        quizzes.filter(
                                                            (q) =>
                                                                q.id !== quiz.id
                                                        )
                                                    );
                                                })
                                                .catch(() =>
                                                    toast.error(
                                                        "Échec de la suppression du quiz"
                                                    )
                                                );
                                        }
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center">
                    <p
                        className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-4`}
                    >
                        Aucun quiz n'est disponible pour ce cours.
                    </p>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 mx-auto ${
                            isDark
                                ? "bg-yellow-700 hover:bg-yellow-600"
                                : "bg-yellow-600 hover:bg-yellow-700"
                        } text-white`}
                        onClick={() => setShowAddQuizModal(true)}
                    >
                        <PlusCircle size={18} />
                        <span>Créer votre premier quiz</span>
                    </button>
                </div>
            )}
        </div>
    );

    const Syllabus = () => (
        <div
            className={`${
                isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}
        >
            <div className="flex items-center gap-2 mb-4">
                <div
                    className={`p-2 rounded-full ${
                        isDark
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    <FileText size={24} />
                </div>
                <h2 className="text-xl font-semibold">Programme du cours</h2>
            </div>

            {course.syllabus ? (
                <div
                    className={`prose max-w-none ${
                        isDark
                            ? "text-gray-300 prose-headings:text-gray-200"
                            : "text-gray-700"
                    }`}
                    dangerouslySetInnerHTML={{ __html: course.syllabus }}
                />
            ) : (
                <div className="py-8 text-center">
                    <p
                        className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                        } mb-4`}
                    >
                        Aucun programme défini pour ce cours.
                    </p>
                    <button
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 mx-auto ${
                            isDark
                                ? "bg-green-700 hover:bg-green-600"
                                : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                        onClick={() =>
                            router.push(`/teacher/courses/${id}/edit`)
                        }
                    >
                        <PlusCircle size={18} />
                        <span>Ajouter un programme</span>
                    </button>
                </div>
            )}
        </div>
    );

    const QuickStats = () => (
        <div
            className={`${
                isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}
        >
            <h3
                className={`font-semibold mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                }`}
            >
                Statistiques du cours
            </h3>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-full ${
                            isDark
                                ? "bg-blue-900 text-blue-300"
                                : "bg-blue-100 text-blue-600"
                        }`}
                    >
                        <Users size={20} />
                    </div>
                    <div>
                        <p
                            className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Élèves inscrits
                        </p>
                        <p className="font-bold">{students.length}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-full ${
                            isDark
                                ? "bg-green-900 text-green-300"
                                : "bg-green-100 text-green-600"
                        }`}
                    >
                        <Check size={20} />
                    </div>
                    <div>
                        <p
                            className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Taux de complétion moyen
                        </p>
                        <p className="font-bold">68%</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-full ${
                            isDark
                                ? "bg-purple-900 text-purple-300"
                                : "bg-purple-100 text-purple-600"
                        }`}
                    >
                        <Award size={20} />
                    </div>
                    <div>
                        <p
                            className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Badges distribués
                        </p>
                        <p className="font-bold">12</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-full ${
                            isDark
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                        <BookCheck size={20} />
                    </div>
                    <div>
                        <p
                            className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Quiz créés
                        </p>
                        <p className="font-bold">{quizzes.length}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={() =>
                        router.push(`/teacher/courses/${id}/analytics`)
                    }
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                        isDark
                            ? "bg-blue-700 hover:bg-blue-600"
                            : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                >
                    <BarChart2 size={18} />
                    <span>Voir les statistiques détaillées</span>
                </button>
            </div>
        </div>
    );

    const StudentsList = () => (
        <div
            className={`${
                isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3
                    className={`font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                    Élèves inscrits
                </h3>
                <button
                    className={`text-sm ${
                        isDark
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-800"
                    }`}
                    onClick={() =>
                        router.push(`/teacher/courses/${id}/students`)
                    }
                >
                    Voir tout
                </button>
            </div>

            {students.length > 0 ? (
                <ul className="space-y-3">
                    {students.slice(0, 5).map((student) => (
                        <li
                            key={student.user.id}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                                isDark
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isDark ? "bg-gray-700" : "bg-gray-200"
                                    } text-gray-500`}
                                >
                                    {student.user.firstname?.charAt(0)}
                                    {student.user.lastname?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {student.user.firstname}{" "}
                                        {student.user.lastname}
                                    </p>
                                    <p
                                        className={`text-sm ${
                                            isDark
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {student.user.email}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="py-6 text-center">
                    <p
                        className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        Aucun élève inscrit à ce cours.
                    </p>
                </div>
            )}

            <div className="mt-4">
                <button
                    onClick={() => router.push(`/teacher/courses/${id}/invite`)}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                        isDark
                            ? "bg-green-700 hover:bg-green-600"
                            : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                >
                    <PlusCircle size={18} />
                    <span>Inviter des élèves</span>
                </button>
            </div>
        </div>
    );

    const AddQuizModal = () => (
        <div className="fixed inset-0 bg-transparent backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
            <div
                className={`${
                    isDark ? "bg-gray-800" : "bg-white"
                } rounded-lg p-6 w-full max-w-md`}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Créer un nouveau quiz
                </h2>

                <form onSubmit={handleAddQuizSubmit}>
                    <div className="mb-4">
                        <label
                            className={`block mb-1 ${
                                isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                            Titre du quiz
                        </label>
                        <input
                            type="text"
                            value={newQuiz.title}
                            onChange={(e) =>
                                setNewQuiz({
                                    ...newQuiz,
                                    title: e.target.value,
                                })
                            }
                            className={`w-full p-2 rounded-lg border ${
                                isDark
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                            }`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className={`block mb-1 ${
                                isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                            Durée (en minutes)
                        </label>
                        <input
                            type="number"
                            value={newQuiz.duration}
                            onChange={(e) =>
                                setNewQuiz({
                                    ...newQuiz,
                                    duration: parseInt(e.target.value),
                                })
                            }
                            className={`w-full p-2 rounded-lg border ${
                                isDark
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                            }`}
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => setShowAddQuizModal(false)}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const UpdateCourse = () => (
        <div className="fixed inset-0 bg-transparent backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`${
                    isDark ? "bg-gray-800 text-white" : "bg-white"
                } rounded-lg p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]`}
            >
                <button
                    className={`absolute top-6 right-6 ${
                        isDark
                            ? "text-gray-400 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setOpenForm(false)}
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-center">
                    "Modifier le cours"
                </h2>

                <AddCourseForm
                    handleSubmit={handleUpdateSubmit}
                    course={course}
                    openForm={openForm}
                />
            </div>
        </div>
    );

    return (
        <div
            className={`p-6 ${
                isDark ? "bg-gray-900 text-white" : "bg-gray-50"
            }`}
        >
            <Header />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Course info */}
                <div className="lg:col-span-2 space-y-6">
                    <CourseInfo />
                    <QuizSection />
                    <Syllabus />
                </div>

                {/* Right column - Students and actions */}
                <div className="space-y-6">
                    <QuickStats />
                    <StudentsList />
                </div>
            </div>

            {/* Modal */}
            {showAddQuizModal && <AddQuizModal />}

            {/* UpdateCourse */}
            {openForm && <UpdateCourse /> }
        </div>
    );
};

export default CoursePage;
