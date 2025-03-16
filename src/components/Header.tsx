"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useAppSelector } from "@/redux/hooks";
import { api } from "@/utils/api";
import useLogout from "@/hooks/useLogout";
import Search from "@/components/Search";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Book, MessageCircle, Moon, Sun, Trophy, User } from "lucide-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

const navigation = {
    student: [
        { name: "Tableau de bord", href: "/student", icon: <User size={20} /> },
        {
            name: "Mes cours",
            href: "/student/courses",
            icon: <Book size={20} />,
        },
        // { name: "Badges", href: "/student/badges", icon: <Trophy size={20} /> },
        // {
        //     name: "Messages",
        //     href: "/student/messages",
        //     icon: <MessageCircle size={20} />,
        // },
    ],
    teacher: [
        { name: "Tableau de bord", href: "/teacher", icon: <User size={20} /> },
        {
            name: "Mes cours",
            href: "/teacher/courses",
            icon: <Book size={20} />,
        },
        // {
        //     name: "Messages",
        //     href: "/teacher/messages",
        //     icon: <MessageCircle size={20} />,
        // },
    ],
    parent: [
        { name: "Tableau de bord", href: "/parent", icon: <User size={20} /> },
        // {
        //     name: "Messages",
        //     href: "/parent/messages",
        //     icon: <MessageCircle size={20} />,
        // },
    ],
    admin: [
        { name: "Tableau de bord", href: "/admin", icon: <User size={20} /> },
        // {
        //     name: "Messages",
        //     href: "/admin/messages",
        //     icon: <MessageCircle size={20} />,
        // },
    ],
};

const Header = () => {
    const pathname = usePathname();
    const { data: me, isLoading } = useRetrieveUserQuery();
    const nav = navigation[me?.role as keyof typeof navigation] ?? [];
    const [scrolled, setScrolled] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const isAuthPage = pathname.startsWith("/auth/");
    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );
    const { onClickLogout, isLoading: isLoggingOut } = useLogout();
    const router = useRouter();

    // Handle scroll events for header visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            // Set scrolled state for shadow effect
            setScrolled(currentScrollPos > 10);

            // Hide/show header based on scroll direction
            setVisible(
                prevScrollPos > currentScrollPos || currentScrollPos < 10
            );

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos, me]);

    const onClickLogin = () => {
        router.push("/auth/login-register");
    };

    const handleSearch = (query: string) => {
        // Rediriger vers la page de recherche avec le paramètre de requête
        router.push(`/search?q=${query}`);
    };

    // Animation variants
    const headerVariants = {
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
            },
        },
        hidden: {
            y: -100,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        },
    };

    const logoVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                delay: 0.1,
                duration: 0.5,
            },
        },
    };

    const searchVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                delay: 0.2,
                duration: 0.5,
            },
        },
    };

    const buttonVariants = {
        initial: { opacity: 0, x: 20 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                delay: 0.3,
                duration: 0.5,
            },
        },
        tap: { scale: 0.95 },
        hover: {
            scale: 1.05,
            backgroundColor: "#f3f4f6",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        },
    };

    return (
        <>
            {!isAuthPage && (
                <AnimatePresence>
                    <motion.header
                        className={`w-full flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50${
                            scrolled ? "shadow-md" : ""
                        }`}
                        variants={headerVariants}
                        initial="visible"
                        animate={visible ? "visible" : "hidden"}
                    >
                        {/* Logo à gauche */}
                        <motion.div
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <Link
                                href="/"
                                aria-label="Go to homepage"
                                className="flex items-center"
                            >
                                <Logo />
                            </Link>
                        </motion.div>

                        {/* Champ de recherche centré */}
                        <motion.div
                            className="flex-grow flex justify-center"
                            variants={searchVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <div className="w-full max-w-lg">
                                <Search onSearch={handleSearch} />
                            </div>
                        </motion.div>

                        {/* Bouton de déconnexion à droite */}
                        {isAuthenticated ? (
                            <motion.div
                                className="flex items-center"
                                variants={buttonVariants}
                                initial="initial"
                                animate="animate"
                            >
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-md mr-3 ${
                                        isDark
                                            ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    }`}
                                    aria-label={
                                        isDark
                                            ? "Activer le mode clair"
                                            : "Activer le mode sombre"
                                    }
                                >
                                    {isDark ? (
                                        <Sun size={20} />
                                    ) : (
                                        <Moon size={20} />
                                    )}
                                </button>
                                     {/* les link specifique a chaque user */}

                                     {nav.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                                    >
                                        {item.icon}
                                    </Link>
                                ))}
                             
                                <motion.button
                                    onClick={onClickLogout}
                                    className="text-black border border-gray-300 px-5 py-1 rounded-full transition duration-150 hover:bg-gray-100 flex items-center justify-center"
                                    disabled={isLoggingOut}
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Deconnecter
                               
                                    <FaSpinner
                                        className={`ml-2 animate-spin ${
                                            !isLoggingOut &&
                                            "text-transparent"
                                        }`}
                                    />
                                
                                </motion.button>

                           
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex items-center"
                                variants={buttonVariants}
                                initial="initial"
                                animate="animate"
                            >
                                <div className="flex items-center">
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-md mr-3 ${
                                            isDark
                                                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                        }`}
                                        aria-label={
                                            isDark
                                                ? "Activer le mode clair"
                                                : "Activer le mode sombre"
                                        }
                                    >
                                        {isDark ? (
                                            <Sun size={20} />
                                        ) : (
                                            <Moon size={20} />
                                        )}
                                    </button>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Link
                                            href="/auth/login"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isDark
                                                    ? "text-gray-300 hover:text-blue-400"
                                                    : "text-gray-700 hover:text-blue-600"
                                            }`}
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                                                isDark
                                                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                        >
                                            S'inscrire
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </motion.header>
                </AnimatePresence>
            )}
        </>
    );
};

export default Header;
