import { FormEvent, useEffect } from "react";
import Input, { type InputProps } from "@/components/Input";
import Logo from "../Logo";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";

const loginFields: InputProps[] = [
    {
        name: "email",
        label: "email",
        placeholder: "example@gmail.com",
        type: "email",
        required: true,
    },
    {
        name: "password",
        label: "password",
        placeholder: "enter your password",
        type: "password",
        required: true,
    },
];

const LoginForm: React.FC<{
    submitHandler: (event: FormEvent<HTMLFormElement>) => void;
    error?: string;
    isLoading?: boolean;
}> = ({ submitHandler, error, isLoading }) => {
    useEffect(() => {}, [error]);
    return (
        <div className="min-h-[75vh] w-[80%] md:w-2/3 xl:w-[40%] bg-transparent flex flex-col justify-center items-center rounded-lg border-gray-500/20 p-[25px] sm:border sm:shadow-2xl sm:backdrop-blur-lg">
            <Link href="/">
                <Logo size={50} />
            </Link>
            <form onSubmit={submitHandler} className="w-full h-full">
                <div>
                    <span className="text-red-600">{error}</span>
                </div>
                {loginFields.map((field, index) => (
                    <Input
                        type={field.type}
                        name={field.name}
                        label={field.label}
                        required={field.required || false}
                        placeholder={field.placeholder || ""}
                        key={index}
                    />
                ))}

                <div className="p-2">
                    <button
                        type="submit"
                        className="w-full flex mt-2 bg-blue-500/95 py-3 rounded-lg items-center justify-center gap-1"
                    >
                        Se connecter
                        <FaSpinner
                            className={`animate-spin ${
                                !isLoading && "text-transparent"
                            }`}
                        />
                    </button>
                </div>
            </form>

            <Link
                href={"/auth/register"}
                className="text-blue-500 hover:underline"
            >
                Already signed up?
            </Link>
        </div>
    );
};

export default LoginForm;
