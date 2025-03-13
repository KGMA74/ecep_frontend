'use client';
import { useAppSelector } from "@/redux/hooks";
import exp from "constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth/");
    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );
    // const { onClickLogout, isLoading } = useLogout();
    // const router = useRouter();

    // const onClickLogin = () => {
    //     router.push('/auth/login-register');
    // }

    return (
        <>
            {!isAuthPage && (
                <footer className="bg-gray-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    eCEP
                                </h4>
                                <p className="text-gray-400">
                                    Plateforme d'apprentissage pour élèves de
                                    CM2
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Liens rapides
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Accueil
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#features"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Fonctionnalités
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            À propos
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Utilisateurs
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/student"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Élèves
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/parent"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Parents
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/teacher"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Enseignants
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Administrateurs
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Contact
                                </h4>
                                <address className="text-gray-400 not-italic">
                                    <p>123, Avenue de l'Éducation</p>
                                    <p>75000 Paris</p>
                                    <p className="mt-3">contact@ecep.fr</p>
                                    <p>01 23 45 67 89</p>
                                </address>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm text-center">
                            <p>
                                © {new Date().getFullYear()} eCEP. Tous droits
                                réservés.
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </>
    );
};

export default Footer;
