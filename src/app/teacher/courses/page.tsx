// 'use client';
// import AddCourseForm from "@/components/form/AddCourseForm";
// import api from "@/utils/api";
// import { FormEvent, useState } from "react";
// import { toast } from "react-toastify";

// const Page = () => {
//     const [openForm, setCloseForm] = useState(false);

//    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         const form = event.target as HTMLFormElement;
//         const title = form['title'].value;
//         const description = form['description'].value;
//         const syllabus = form['syllabus'].value;
//         const matter = form['matter'].value;
//         const start_date = form['start_date'].value;
//         const end_date = form['end_date'].value;
//         alert(matter)

//         await api.post('courses/', {
//                     json: {
//                         title,
//                         description,
//                         syllabus,
//                         matter,
//                         start_date,
//                         end_date
//                     }

//                 })
//                 .then(_ => {toast.success("nouveau cours cree avec success"); console.log("creation des cours::::::::::;", _)})
//                 .catch(_ => toast.error("erreur survenu lors de la creation du cours"));
//     }

//     return (
//         <div className="h-full flex items-center justify-center">

//         <AddCourseForm handleSubmit={handleSubmit} openForm={openForm}/>
//         </div>
//     );
// }

// export default Page;

"use client";

import React, { useState, FormEvent, useEffect } from "react";
import {
    Search,
    Plus,
    Book,
    Award,
    Users,
    Filter,
    Edit,
    Trash2,
    Eye,
    X,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "@/components/DatePicker";
import { Course } from "@/utils/type";
import AddCourseForm from "@/components/form/AddCourseForm";
import api from "@/utils/api";
import { toast } from "react-toastify";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";


const Page = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [courses, setCourses] = useState<Course[]>([]);
    const [showDeletePopUP, setShowDeletePopUP] = useState<boolean>(false);
    const [currentCourse, setCurrentCourse] = useState<Course | undefined>();
    const [matters, setMatters] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [openForm, setOpenForm] = useState(false);

    const fetchCourses = async () => {
        await api
            .get('matters/')
            .json<{name: string, description: string}[]>()
            .then(resp => setMatters(resp.map(t => t.name)))
            .catch(_ => _);

        await api
            .get("courses/user_courses/")
            .json<Course[]>()
            .then((resp) => setCourses(resp))
            .catch((err) => console.log(err));
    };
    
    useEffect(() => {
        fetchCourses();
    }, [currentCourse]);   
    
    
    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (subjectFilter === "" || course.matter === subjectFilter)
    );

    const handleUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        await api
            .patch(`courses/${currentCourse?.id}/`, {
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
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        await api
            .post('courses/', {
                json: Object.fromEntries(formData),
            })
            .then((_) => {
                toast.success("nouveau cours cree avec success");
            })
            .catch((_) =>
                toast.error("erreur survenu lors de la creation du cours")
            );

        setOpenForm(false);
    };

    return (
        <div className={`p-6 max-w-6xl mx-auto ${isDark ? 'bg-gray-900 text-white' : ''}`}>
            <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>Mes Cours</h1>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                onClick={() => {
                    setCurrentCourse(undefined);
                    setOpenForm(true);
                }}
            >
                <Plus size={20} />
                <span>Nouveau cours</span>
            </button>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 flex items-center gap-3`}>
                <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-100'} p-3 rounded-full`}>
                <Book className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                </div>
                <div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Total des cours</p>
                <p className="text-2xl font-bold">{courses.length}</p>
                </div>
            </div>

            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 flex items-center gap-3`}>
                <div className={`${isDark ? 'bg-green-900' : 'bg-green-100'} p-3 rounded-full`}>
                <Users className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={24} />
                </div>
                <div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Élèves actifs</p>
                <p className="text-2xl font-bold">94</p>
                </div>
            </div>

            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 flex items-center gap-3`}>
                <div className={`${isDark ? 'bg-purple-900' : 'bg-purple-100'} p-3 rounded-full`}>
                <Award className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                </div>
                <div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                    Badges distribués
                </p>
                <p className="text-2xl font-bold">126</p>
                </div>
            </div>
            </div>

            {/* Search and Filters */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow mb-6`}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>

                <div className="w-full md:w-64">
                <div className="relative">
                    <Filter
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                    />
                    <select
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'
                    }`}
                    value={subjectFilter}
                    onChange={(e) =>
                        setSubjectFilter(e.target.value)
                    }
                    >
                    <option value="">Toutes les matières</option>
                    {matters.map((subject) => (
                        <option key={subject} value={subject}>
                        {subject}
                        </option>
                    ))}
                    </select>
                </div>
                </div>
            </div>
            </div>

            {/* Courses List */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Cours
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Matièrestudent
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Élèves
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Progression
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Badges
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Mis à jour
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {filteredCourses.map((course) => (
                    <tr key={course.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {course.title}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        {course.matter}
                        </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {course.students?.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2.5`}>
                            <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                                width: `${course.completion}%`,
                            }}
                            ></div>
                        </div>
                        <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                            {course.completionRate}%
                        </span>
                        </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {course.badges}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {formatDate(course.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                        <button className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                            onClick={_ => router.push(`/teacher/courses/${course.id}`)}
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                            onClick={() => {
                            setCurrentCourse(course);
                            setOpenForm(true);
                            }}
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                            onClick={(_) => {
                            setCurrentCourse(course);
                            setShowDeletePopUP(true);
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                        {showDeletePopUP && (
                            <div className="fixed inset-0 bg-transparent backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
                                <h3 className="text-lg font-bold mb-4">
                                Confirmer la suppression
                                </h3>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 text-`}>
                                Êtes-vous sûr de vouloir
                                supprimer ce cours ?
                                Cette action est
                                irréversible.
                                </p>
                                <div className="flex justify-end gap-4">
                                <button
                                    className={`px-4 py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                    onClick={_ => setShowDeletePopUP(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={async () => {
                                    await api.delete(`courses/${currentCourse?.id}/`);
                                    setShowDeletePopUP(false);
                                    }}
                                >
                                    Supprimer
                                </button>
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Aucun cours trouvé</p>
                </div>
            )}
            </div>
        
            {/* Add/Edit Course Modal - Made larger */}
            {openForm && (
            <div className="fixed inset-0 bg-transparent backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]`}>
                <button
                    className={`absolute top-6 right-6 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setOpenForm(false)}
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-center">
                    {currentCourse
                    ? "Modifier le cours"
                    : "Ajouter un nouveau cours"}
                </h2>

                        <AddCourseForm
                            handleSubmit={currentCourse?handleUpdateSubmit:handleSubmit}
                            course={currentCourse}
                            openForm={openForm}
                        />
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Page;
