"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, BookOpen, Award, Send } from "lucide-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { Student } from "@/utils/type";


const ParentDashboard = () => {
  const { data: me, isLoading } = useRetrieveUserQuery();
  const [children, setChildren] = useState<Student[]>([]);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMode, setVerificationMode] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);


  const fetchChildren = async () => {
    try {
      if (me?.id) {
        const response = await api.get(`parents/children/`).json<Student[]>();
        if (response) {
          setChildren(response);
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);

    }
  };

  useEffect(() => {
    if (!isLoading && me?.id) {
      fetchChildren();
    }
  }, [isLoading, me]);

  const handleRequestVerification = async () => {
    try {
      const response = await api.post(`students/request_verification/`, {
        json: { email: studentEmail },
      }).json();
      
      setVerificationMode(true);
      toast.success("lien pour finaliser l'ajout a été envoyé à l'adresse email de l'evele.");
    } catch (error) {
      console.error("Error requesting verification:", error);
      toast("Impossible d'envoyer le code de vérification. Vérifiez l'adresse email.");
    }
  };

  const handleVerifyAndAdd = async () => {
    try {
      if (!selectedStudentId) {
        throw new Error("Student ID not found");
      }

      await api.post(`students/${selectedStudentId}/verify_and_add/`, {
        json: { code: verificationCode },
      }).json();

      toast("L'étudiant a été ajouté à votre liste d'enfants.");

      // Reset form and fetch updated children list
      setVerificationMode(false);
      setStudentEmail("");
      setVerificationCode("");
      setSelectedStudentId(null);
      setIsAddingChild(false);
      fetchChildren();
    } catch (error) {
      console.error("Error verifying code:", error);
      toast("Code de vérification invalide ou expiré.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour, {me?.firstname} {me?.lastname} 👋
          </h1>
          <p className="text-gray-500">
            Bienvenue sur votre espace parent
          </p>
        </div>

        <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Ajouter un enfant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {verificationMode ? "Saisir le code de vérification" : "Ajouter un enfant"}
              </DialogTitle>
            </DialogHeader>
            {!verificationMode ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Entrez l'adresse email de votre enfant pour lui envoyer une demande de vérification
                </p>
                <Input
                  placeholder="Email de l'étudiant"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={handleRequestVerification}
                >
                  <Send size={16} className="mr-2" />
                  Envoyer le code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Un code a été envoyé à l'adresse {studentEmail}. Saisissez-le ci-dessous pour valider.
                </p>
                <Input
                  placeholder="Code de vérification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={handleVerifyAndAdd}
                >
                  Vérifier et ajouter
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-blue-500" size={20} />
              Mes enfants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">Vous n'avez pas encore ajouté d'enfant</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddingChild(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un enfant
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {children.length>0 && children.map((child) => (
                  <div 
                    key={child.user.id} 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">
                        {child.user.firstname} {child.user.lastname}
                      </h3>
                      <p className="text-sm text-gray-500">{child.user.email}</p>
                    </div>
                    
                    <div className="flex gap-3 mt-2 md:mt-0">
                      {child.level && (
                        <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <Award size={14} className="mr-1" />
                          Niveau {child.level.level}
                        </div>
                      )}
                      
                      {child.courses_count && (
                        <div className="flex items-center text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
                          <BookOpen size={14} className="mr-1" />
                          {child.courses_count} cours
                        </div>
                      )}
                      
                      <Link href={`/parent/child/${child.user.id}`}>
                        <Button variant="outline" size="sm">
                          Voir le détail
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Additional stats or information cards can be added here */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Guide parent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>En tant que parent, vous pouvez :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Suivre les progrès de vos enfants</li>
                <li>Consulter leurs cours</li>
                <li>Voir leurs accomplissements</li>
                <li>Être notifié des événements importants</li>
              </ul>
              <Link href="/parent/guide" className="text-blue-500 hover:underline block mt-3">
                En savoir plus →
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Aucun événement à venir pour le moment.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Ressources éducatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/resources/homework" className="block text-sm text-blue-500 hover:underline">
                Guide d'aide aux devoirs
              </Link>
              <Link href="/resources/learning" className="block text-sm text-blue-500 hover:underline">
                Conseils d'apprentissage
              </Link>
              <Link href="/resources/digital" className="block text-sm text-blue-500 hover:underline">
                Outils numériques éducatifs
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;