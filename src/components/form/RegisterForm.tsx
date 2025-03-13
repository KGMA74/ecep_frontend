"use client";
import { FormEvent, useState } from "react";
import Input, { type InputProps } from "@/components/Input";
import Link from "next/link";
import Logo from "../Logo";
import { FaSpinner } from "react-icons/fa";

interface Props {
    submitHandler: (event: FormEvent<HTMLFormElement>, role: string) => void;
}

const commonFields: InputProps[] = [
    {
        name: "firstname",
        label: "firstname",
        placeholder: "Entrer votre prenom(s)",
        type: "text",
        required: true,
    },
    {
        name: "lastname",
        label: "lastname",
        placeholder: "Entrer votre nom",
        type: "text",
        required: true,
    },
    {
        name: "email",
        label: "Email",
        placeholder: "example@gmail.com",
        type: "email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        type: "password",
        required: true,
    },
    {
        name: "re_password",
        label: "Confirm Password",
        placeholder: "Confirm your password",
        type: "password",
        required: true,
    },
];

const specificFields = {
    eleve: [
        {
            name: "grade",
            label: "Grade",
            placeholder: "Enter your grade",
            type: "text",
            required: true,
        },
    ],
    parent: [
        {
            name: "children_count",
            label: "Number of children",
            placeholder: "Enter number of children",
            type: "number",
            required: true,
        },
    ],
    enseignant: [
        {
            name: "subject",
            label: "Subject",
            placeholder: "Enter the subject you teach",
            type: "text",
            required: true,
        },
    ],
};

const RegisterForm: React.FC<{
    submitHandler: (event: FormEvent<HTMLFormElement>, role: string) => void;
    isLoading?: boolean;
}> = ({ submitHandler, isLoading }) => {
    const [role, setRole] = useState<string | null>(null);

    // Gérer le changement de rôle
    const handleRoleSelection = (selectedRole: string) => {
        setRole(selectedRole);
    };

    // Combiner les champs communs avec les champs spécifiques selon le rôle
    const getFieldsForRole = () => {
        return [
            ...commonFields,
            ...(specificFields[role as keyof typeof specificFields] || []),
        ];
    };

    return (
        <div className="flex h-full w-full justify-center items-center">
            {!role ? (
                <div className="flex flex-col md:flex-row gap-2 items-center justify-around w-full h-full px-4 py-8">
                    <div
                        className={`h-64 w-64 border rounded-lg flex flex-col justify-center items-center cursor-pointer shadow-md transition-all hover:shadow-lg ${
                            role === "eleve"
                                ? "border-blue-500 bg-blue-100"
                                : "bg-blue-50 hover:bg-blue-100 border-blue-200"
                        }`}
                        onClick={() => handleRoleSelection("eleve")}
                    >
                        <div className="text-4xl mb-4">👨‍🎓</div>
                        <div className="text-xl font-medium text-blue-700">
                            Élève
                        </div>
                        <div className="text-sm text-blue-600 mt-2 text-center px-4">
                            Accès aux cours et aux exercices
                        </div>
                    </div>

                    <div
                        className={`h-64 w-64 border rounded-lg flex flex-col justify-center items-center cursor-pointer shadow-md transition-all hover:shadow-lg ${
                            role === "parent"
                                ? "border-green-500 bg-green-100"
                                : "bg-green-50 hover:bg-green-100 border-green-200"
                        }`}
                        onClick={() => handleRoleSelection("parent")}
                    >
                        <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                        <div className="text-xl font-medium text-green-700">
                            Parent
                        </div>
                        <div className="text-sm text-green-600 mt-2 text-center px-4">
                            Suivez les progrès de vos enfants
                        </div>
                    </div>

                    <div
                        className={`h-64 w-64 border rounded-lg flex flex-col justify-center items-center cursor-pointer shadow-md transition-all hover:shadow-lg ${
                            role === "enseignant"
                                ? "border-purple-500 bg-purple-100"
                                : "bg-purple-50 hover:bg-purple-100 border-purple-200"
                        }`}
                        onClick={() => handleRoleSelection("enseignant")}
                    >
                        <div className="text-4xl mb-4">👩‍🏫</div>
                        <div className="text-xl font-medium text-purple-700">
                            Enseignant
                        </div>
                        <div className="text-sm text-purple-600 mt-2 text-center px-4">
                            Créez et gérez vos cours
                        </div>
                    </div>
                </div>
            ) : (
                // Formulaire d'inscription après sélection du rôle
                <div className="min-h-[75vh] w-[80%] md:w-2/3 xl:w-[40%] bg-transparent flex flex-col justify-center items-center rounded-lg border-gray-500/20 p-[25px] sm:border sm:shadow-2xl sm:backdrop-blur-lg">
                    <Link href="/">
                        <Logo size={50} />
                    </Link>
                    <form
                        onSubmit={(e) => submitHandler(e, role)}
                        className="w-full h-full"
                    >
                        {getFieldsForRole().map((field, index) => (
                            <Input
                                key={index}
                                type={field.type}
                                name={field.name}
                                label={field.label}
                                required={field.required}
                                placeholder={field.placeholder}
                            />
                        ))}

                        <div className="p-2">
                            <button
                                type="submit"
                                className="w-full flex mt-2 bg-blue-500/95 py-2 rounded-lg items-center justify-center gap-1"
                            >
                                S'inscrire
                                <FaSpinner
                                    className={`animate-spin ${
                                        !isLoading && "text-transparent"
                                    }`}
                                />
                            </button>
                        </div>
                    </form>
                    <Link
                        href={"/auth/login"}
                        className="text-blue-500 hover:underline"
                    >
                        Already signed up?
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RegisterForm;
