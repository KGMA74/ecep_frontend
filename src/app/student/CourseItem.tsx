// components/student/CourseItem.tsx
import React from 'react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CourseItemProps {
  id: number;
  title: string;
  subject: string;
  progress: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CourseItem: React.FC<CourseItemProps> = ({ 
  id, 
  title, 
  subject, 
  progress, 
  difficulty 
}) => {
  // Fonction pour déterminer la couleur du badge de difficulté
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Traduire le niveau de difficulté en français
  const difficultyLabel = {
    easy: 'Facile',
    medium: 'Intermédiaire',
    hard: 'Difficile'
  }[difficulty];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link 
            href={`/student/courses/${id}`}
            className="text-lg font-medium hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
          <div className="flex gap-2">
            <Badge variant="outline">{subject}</Badge>
            <Badge variant={getDifficultyVariant(difficulty)}>{difficultyLabel}</Badge>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseItem;