'use client'
import { CourseProgress } from "@/utils/type";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Book, Search, Filter, Clock, Award, BookOpen } from "lucide-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

export default function CoursesPage() {
  const {data: me, isLoading: isMeLoading} = useRetrieveUserQuery();
  const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [matters, setMatters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);

  const fetchCourses = async () => {
    setIsLoading(true);
            await api
                .get('matters/')
                .json<{name: string, description: string}[]>()
                .then(resp => setMatters(resp.map(t => t.name)))
                .catch(_ => _);
    
    await api
      .get(`course-progress/user_progress/`)
      .json<CourseProgress[]>()
      .then((resp) => {
        setCoursesProgress(resp);
       
        // Calculer les badges gagnés (exemple)
        const badges = 4;
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
    return b.progress_percentage - a.progress_percentage;
  });

  if (isLoading || isMeLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

  return (
    <div className="container mx-auto p-4 min-h-[63vh]">
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
            <p className="font-bold">{me?.student?.xp}</p>
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
            
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
