"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const iconVariants = {
    initial: { scale: 0.6, opacity: 0, rotate: -30 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      } 
    },
    exit: { 
      scale: 0.6, 
      opacity: 0, 
      rotate: 30,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg bg-white dark:bg-gray-800 z-50 text-gray-800 dark:text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={iconVariants}
        key={theme}
      >
        {theme === "light" ? (
          <FaMoon size={20} />
        ) : (
          <FaSun size={20} />
        )}
      </motion.div>
    </motion.button>
  );
}