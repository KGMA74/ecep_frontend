// 'use client'

// import { CourseProgress } from "@/utils/type";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { useState, useEffect} from "react";
// import api from "@/utils/api";

// export default function CoursesPage() {
//     const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([]);
    
//     const fetchCourses = async () => {
//         await api
//             .get(`course-progress/user_progress/`)
//             .json<CourseProgress[]>()
//             .then((resp) => setCoursesProgress(resp))
//             .catch((error) => console.error(error));
//     };
    
//     useEffect(() => {
//       fetchCourses();
//     }, [])
    
//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Mes cours</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {coursesProgress.map((courseProgress) => (
//                     <div key={courseProgress.course.id} className="border rounded-lg p-4 shadow-sm">
//                         <div className="flex justify-between">
//                             <Link
//                                 href={`/student/courses/${courseProgress.course.id}`}
//                                 className="text-xl font-semibold hover:text-blue-500"
//                             >
//                                 {courseProgress.course.title}
//                             </Link>
//                             <Badge variant="outline" className="text-xs">
//                                 {courseProgress.course.matter}
//                             </Badge>
//                         </div>
//                         <p className="text-gray-600 mt-2">{courseProgress.course.description}</p>
//                         <div className="mt-4">
//                             <Progress value={courseProgress.progress_percentage} className="h-1.5" />
//                             <p className="text-xs text-gray-500 text-right mt-1">
//                                 {courseProgress.progress_percentage}% terminé
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }
'use client'
import { CourseProgress } from "@/utils/type";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Book, Search, Filter, Clock, Award, BookOpen } from "lucide-react";

export default function CoursesPage() {
  const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);

  const fetchCourses = async () => {
    setIsLoading(true);
    await api
      .get(`course-progress/user_progress/`)
      .json<CourseProgress[]>()
      .then((resp) => {
        setCoursesProgress(resp);
        // Calculer les XP totaux (exemple)
        const xp = resp.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0);
        setTotalXP(xp);
        
        // Calculer les badges gagnés (exemple)
        const badges = resp.reduce((acc, curr) => acc + (curr.earned_badges?.length || 0), 0);
        setEarnedBadges(badges);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Liste des matières uniques
  const subjects = [...new Set(coursesProgress.map(cp => cp.course.matter))];

  // Filtrage des cours
  const filteredCourses = coursesProgress.filter(cp => 
    cp.course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (subjectFilter === "" || cp.course.matter === subjectFilter)
  );

  // Tri des cours (les plus récemment consultés en premier)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    // Exemple - peut être remplacé par un tri sur last_access_date si disponible
    return b.progress_percentage - a.progress_percentage;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mes cours</h1>
      
      {/* Stats des progrès de l'élève */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center">
          <div className="mr-3 bg-blue-100 p-2 rounded-full">
            <BookOpen className="text-blue-500" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cours en cours</p>
            <p className="font-bold">{coursesProgress.length}</p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center">
          <div className="mr-3 bg-green-100 p-2 rounded-full">
            <Award className="text-green-500" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Badges gagnés</p>
            <p className="font-bold">{earnedBadges}</p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center">
          <div className="mr-3 bg-purple-100 p-2 rounded-full">
            <Book className="text-purple-500" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">XP Total</p>
            <p className="font-bold">{totalXP}</p>
          </div>
        </div>
      </div>
      
      {/* Options de recherche et filtrage */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="pl-10 pr-4 py-2 w-full border rounded-lg appearance-none"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* État de chargement */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement des cours...</p>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">Aucun cours trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCourses.map((courseProgress) => (
            <div key={courseProgress.course.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between">
                <Link
                  href={`/student/courses/${courseProgress.course.id}`}
                  className="text-xl font-semibold hover:text-blue-500"
                >
                  {courseProgress.course.title}
                </Link>
                <Badge variant="outline" className="text-xs">
                  {courseProgress.course.matter}
                </Badge>
              </div>
              
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{courseProgress.course.description}</p>
              
              {/* Section badges */}
              {/* {courseProgress.earned_badges && courseProgress.earned_badges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {courseProgress.earned_badges.slice(0, 3).map((badge, idx) => (
                    <Badge key={idx} className="bg-yellow-100 text-yellow-800 text-xs">
                      {badge.name || `Badge ${idx + 1}`}
                    </Badge>
                  ))}
                  {courseProgress.earned_badges.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-800 text-xs">
                      +{courseProgress.earned_badges.length - 3}
                    </Badge>
                  )}
                </div>
              )} */}
              
              {/* <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">
                    <Clock size={12} className="inline mr-1" />
                    {courseProgress.last_access ? new Date(courseProgress.last_access).toLocaleDateString() : "Jamais consulté"}
                  </span>
                  <span className="text-xs font-medium">
                    {courseProgress.completed_lessons || 0}/{courseProgress.total_lessons || "?"} leçons
                  </span>
                </div>
                <Progress value={courseProgress.progress_percentage} className="h-1.5" />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {courseProgress.progress_percentage}% terminé
                </p>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
