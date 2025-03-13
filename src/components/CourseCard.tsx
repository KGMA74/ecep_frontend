// CourseCard.tsx
'use client';
import Image from "next/image";
import type { Course } from "@/utils/type";
import useUser from "@/hooks/useUser";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    
  // Utilisation du hook pour récupérer l'utilisateur via course.requested_by
  const { user, isLoading, error } = useUser(course.created_by);



  return (
    <div className="flex flex-col items-center justify-center p-4 m-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-lg">{course.description}</p>
      <div className="flex items-center justify-center">
        <Image
          src={user?.profile?.avatar || '/default-avatar.png'}
          alt={user?.nickname || ''}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">{user?.nickname || 'author'}</h2>
          {/* <p className="text-sm">{user.specialty}</p> */}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

