"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Créer le contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialiser avec null pour indiquer que le thème n'est pas encore déterminé
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // Vérifier le thème enregistré
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const initialTheme = savedTheme || "light"; // Mode par défaut
    
    setTheme(initialTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    if (!theme) return; // Protection contre les appels avant l'initialisation
    
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme); // Sauvegarde du choix

    setTheme(newTheme);
  };

  // Attendre que le thème soit déterminé avant de rendre les enfants
  // ou fournir une valeur par défaut pour le contexte
  return (
    <ThemeContext.Provider value={{ 
      theme: theme || "light", 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}