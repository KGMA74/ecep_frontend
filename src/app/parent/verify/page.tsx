"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";




const VerificationPage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");
    const studentId = searchParams.get("student_id");
    const [verificationState, setVerificationState] = useState<
        "loading" | "success" | "error"
    >("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const verifyCode = async () => {
            // Get the code and student ID from URL parameters
    
            
            if (!studentId || !code) {
                setVerificationState("error");
                setErrorMessage("Paramètres de vérification manquants ou invalides.");
                return;
            }

            try {
                // Call the API to verify the code and add the student
                await api.post(`students/${studentId}/verify_and_add/`, {
                    json: { code }
                });
                
                setVerificationState("success");
            } catch (error) {
                console.error("Verification error:", error);
                setVerificationState("error");
                setErrorMessage(
                    "Impossible de vérifier le code. Il peut être expiré ou invalide."
                );
            }
        };

        verifyCode();
    }, [searchParams]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className={`max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
                {verificationState === "loading" && (
                    <div className="text-center py-8">
                        <Loader2 className="animate-spin h-12 w-12 mx-auto text-blue-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Vérification en cours</h2>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Nous vérifions votre code, veuillez patienter...
                        </p>
                    </div>
                )}

                {verificationState === "success" && (
                    <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Vérification réussie !</h2>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                            L&apos;élève a été ajouté avec succès à votre compte parent.
                        </p>
                        <Link href="/parent">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors w-full">
                                Accéder au tableau de bord
                            </button>
                        </Link>
                    </div>
                )}

                {verificationState === "error" && (
                    <div className="text-center py-8">
                        <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Échec de la vérification</h2>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            {errorMessage || "Une erreur s'est produite lors de la vérification du code."}
                        </p>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                            Le code pourrait être expiré ou invalide. Veuillez demander un nouveau code.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <Link href="/parent/dashboard">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors w-full">
                                    Retour au tableau de bord
                                </button>
                            </Link>
                            <Link href="/parent">
                                <button className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} font-medium py-2 px-6 rounded-md transition-colors w-full`}>
                                    Demander un nouveau code
                                    {code}
                                    {studentId}
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationPage;