"use client"

import LoginForm from "@/components/form/LoginForm";
import { useTheme } from "@/context/ThemeContext";
import {useLogin, useRegister } from "@/hooks/";
import { useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Bubble {
  width: number;
  height: number;
  left: string;
  top: string;
}

const Page = () => {

  const {isAuthenticated} = useAppSelector((state) => state.auth);
  const { loginSubmit, isLoading } = useLogin()
   const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const numberOfBubbles = 20; 

    useEffect(() => {
    
  
      const newBubbles = Array.from({ length: numberOfBubbles }, () => ({
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }));
      
      setBubbles(newBubbles);
  
    }, []);

  return (
    <div className="flex w-full h-full justify-center items-center">
      {bubbles.map((bubble, index) => (
              <motion.div
                key={index}
                className={`absolute rounded-full ${
                  isDark ? 'bg-blue-900 opacity-20' : 'bg-blue-100 opacity-40'
                }`}
                style={bubble}
                animate={{
                  y: [0, 10, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
      
      <LoginForm submitHandler={loginSubmit} isLoading={isLoading}/>
    </div>
  );
};

export default Page;
