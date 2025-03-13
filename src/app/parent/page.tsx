'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Book, Award, User, Users, Plus, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  level: string;
  xp_points: number;
  badges: Badge[];
};

type Badge = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
};

type CourseProgress = {
  course_id: number;
  course_name: string;
  subject: string;
  progress: number;
  last_activity: string;
};

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProgress, setStudentProgress] = useState<CourseProgress[]>([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [registrationForm, setRegistrationForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    level: 'CM2'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchStudents();
    }
  }, [status, router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/parent/children');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer la liste de vos enfants',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const fetchStudentProgress = async (studentId: number) => {
    try {
      const response = await axios.get(`/api/student/${studentId}/progress`);
      setStudentProgress(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des progrès:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les progrès de cet élève',
        variant: 'destructive',
      });
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentProgress(student.id);
  };

  const searchStudent = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await axios.get(`/api/students/search?query=${searchQuery}`);
      setSearchResults(response.data);
      setIsSearching(false);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: 'Erreur de recherche',
        description: 'Impossible de trouver des élèves correspondant à votre recherche',
        variant: 'destructive',
      });
      setIsSearching(false);
    }
  };

  const handleAddExistingStudent = async (studentId: number) => {
    try {
      await axios.post('/api/parent/children/add', { student_id: studentId });
      toast({
        title: 'Demande envoyée',
        description: 'Un code de vérification a été envoyé à l\'élève pour confirmation',
      });
      setIsAddingStudent(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter cet élève',
        variant: 'destructive',
      });
    }
  };

  const handleAddByEmail = async () => {
    if (!studentEmail.trim()) return;
    
    try {
      await axios.post('/api/parent/children/add-by-email', { email: studentEmail });
      toast({
        title: 'Demande envoyée',
        description: 'Un code de vérification a été envoyé à cette adresse email pour confirmation',
      });
      setStudentEmail('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout par email:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'invitation à cette adresse email',
        variant: 'destructive',
      });
    }
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationForm.password !== registrationForm.password_confirm) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await axios.post('/api/parent/children/register', registrationForm);
      toast({
        title: 'Inscription réussie',
        description: 'L\'élève a été inscrit et ajouté à votre compte',
      });
      setRegistrationForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        level: 'CM2'
      });
      fetchStudents();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'inscrire l\'élève',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Espace Parent</h1>
        <Button onClick={() => setIsAddingStudent(true)} className="flex items-center gap-2">
          <Plus size={16} /> Ajouter un élève
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Liste des élèves */}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} /> Mes élèves
              </CardTitle>
              <CardDescription>
                Liste des élèves dont vous suivez la progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Vous n'avez pas encore d'élèves ajoutés</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingStudent(true)}
                    className="mt-4"
                  >
                    Ajouter un élève
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div 
                      key={student.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div className="font-medium">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-sm opacity-90">{student.level}</div>
                      <div className="flex items-center gap-1 text-sm mt-1 opacity-80">
                        <Book size={14} />
                        <span>{student.xp_points} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Détails de l'élève */}
        <div className="md:col-span-8">
          {!selectedStudent ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Sélectionnez un élève pour voir ses détails et sa progression
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="progress">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                      </CardTitle>
                      <CardDescription>
                        Niveau: {selectedStudent.level} · {selectedStudent.email}
                      </CardDescription>
                    </div>
                    <TabsList>
                      <TabsTrigger value="progress">Progression</TabsTrigger>
                      <TabsTrigger value="badges">Badges ({selectedStudent.badges?.length || 0})</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <CardContent>
                  <TabsContent value="progress" className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <Book size={28} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Points d'expérience totaux</div>
                        <div className="text-3xl font-bold">{selectedStudent.xp_points} XP</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Progression des cours</h3>
                      
                      {studentProgress.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Aucun cours suivi pour le moment</p>
                        </div>
                      ) : (
                        studentProgress.map((course) => (
                          <div key={course.course_id} className="space-y-2">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">{course.course_name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {course.subject}
                                </span>
                              </div>
                              <span className="text-sm">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              Dernière activité: {new Date(course.last_activity).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="badges" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedStudent.badges?.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          <Award size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Aucun badge obtenu pour le moment</p>
                        </div>
                      ) : (
                        selectedStudent.badges?.map((badge) => (
                          <Card key={badge.id} className="overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center">
                              <Award size={48} className="text-primary-foreground" />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold">{badge.name}</h4>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                              <p className="text-xs mt-2 text-muted-foreground">
                                Obtenu le {new Date(badge.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          )}
        </div>
      </div>

      {/* Modal d'ajout d'élève */}
      <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un élève</DialogTitle>
            <DialogDescription>
              Ajoutez un élève existant ou inscrivez un nouvel élève sur la plateforme
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="search" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="search">Rechercher</TabsTrigger>
              <TabsTrigger value="email">Par email</TabsTrigger>
              <TabsTrigger value="register">Inscrire</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher un élève par nom ou prénom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={searchStudent} disabled={isSearching}>
                  <Search size={16} />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((student) => (
                    <div 
                      key={student.id} 
                      className="flex justify-between items-center p-3 rounded border hover:bg-muted"
                    >
                      <div>
                        <div className="font-medium">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{student.level}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleAddExistingStudent(student.id)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <p className="text-center text-muted-foreground py-4">
                  Aucun élève trouvé
                </p>
              )}
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email de l'élève</Label>
                <Input
                  id="email"
                  placeholder="email@exemple.com"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleAddByEmail} className="w-full">
                Envoyer une invitation
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegisterStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input
                      id="first_name"
                      value={registrationForm.first_name}
                      onChange={(e) => setRegistrationForm({...registrationForm, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input
                      id="last_name"
                      value={registrationForm.last_name}
                      onChange={(e) => setRegistrationForm({...registrationForm, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register_email">Email</Label>
                  <Input
                    id="register_email"
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={registrationForm.password}
                    onChange={(e) => setRegistrationForm({...registrationForm, password: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="password_confirm"
                    type="password"
                    value={registrationForm.password_confirm}
                    onChange={(e) => setRegistrationForm({...registrationForm, password_confirm: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <select
                    id="level"
                    className="w-full p-2 rounded-md border"
                    value={registrationForm.level}
                    onChange={(e) => setRegistrationForm({...registrationForm, level: e.target.value})}
                  >
                    <option value="CM2">CM2</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Inscrire l'élève
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsAddingStudent(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}