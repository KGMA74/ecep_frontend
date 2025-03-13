'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop, Book, Users, User, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface Bubble {
  width: number;
  height: number;
  left: string;
  top: string;
}

export default function HomePage2() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });
  
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const numberOfBubbles = 20; 

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }

    const newBubbles = Array.from({ length: numberOfBubbles }, () => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    
    setBubbles(newBubbles);

  }, [isInView, controls]);

  const userCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div 
      ref={scrollRef} 
      className={`min-h-screen overflow-hidden relative ${
        isDark 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-blue-50 to-white'
      }`}
    >
      {/* Animated Background Elements */}
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

      {/* <motion.nav 
        className={`border-b relative z-10 ${
          isDark ? 'bg-gray-800 border-gray-700 shadow-md' : 'bg-white shadow-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <motion.span 
                  className={`font-bold text-2xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  eCEP
                </motion.span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-md mr-3 ${
                  isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link 
                  href="/auth/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Connexion
                </Link>
                <Link 
                  href="/auth/register" 
                  className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  S'inscrire
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav> */}

      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            className={`text-4xl font-extrabold sm:text-5xl md:text-6xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Bienvenue sur 
            </motion.span>
            <motion.span 
              className={`block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              eCEP
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className={`mt-6 max-w-2xl mx-auto text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Une plateforme d'apprentissage interactive pour les élèves de CM2,
            conçue pour motiver et suivre les progrès.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link 
              href="/auth/login-register" 
              className={`px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:text-lg ${
                isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Commencer maintenant
            </Link>
            <a 
              href="#features" 
              className={`ml-4 px-8 py-3 border text-base font-medium rounded-md md:text-lg ${
                isDark 
                  ? 'text-blue-400 bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'text-blue-600 bg-white hover:bg-gray-50 border-transparent'
              }`}
            >
              En savoir plus
            </a>
          </motion.div>
        </div>

        {/* User Type Selection */}
        <div id="features" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-20">
          {/* Élève */}
          <motion.div 
            className={`p-6 rounded-lg transition-shadow ${
              isDark 
                ? 'bg-gray-800 shadow-lg hover:shadow-xl shadow-gray-900/30' 
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            variants={userCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isDark ? 'bg-blue-900' : 'bg-blue-100'
            }`}>
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <User className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />
              </motion.div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : ''
            }`}>Élèves</h3>
            <p className={`mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Accédez à vos cours, gagnez des badges et suivez votre progression.
            </p>
            <Link 
              href="/student" 
              className={`flex items-center text-sm font-medium group ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Espace élève
              <motion.div
                className="ml-1"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </Link>
          </motion.div>

          {/* Parent */}
          <motion.div 
            className={`p-6 rounded-lg transition-shadow ${
              isDark 
                ? 'bg-gray-800 shadow-lg hover:shadow-xl shadow-gray-900/30' 
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            variants={userCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isDark ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Users className={isDark ? 'text-green-400' : 'text-green-600'} size={24} />
              </motion.div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : ''
            }`}>Parents</h3>
            <p className={`mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Suivez les progrès de vos enfants et restez informés de leur parcours scolaire.
            </p>
            <Link 
              href="/parent" 
              className={`flex items-center text-sm font-medium ${
                isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'
              }`}
            >
              Espace parent
              <motion.div
                className="ml-1"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </Link>
          </motion.div>

          {/* Enseignant */}
          <motion.div 
            className={`p-6 rounded-lg transition-shadow ${
              isDark 
                ? 'bg-gray-800 shadow-lg hover:shadow-xl shadow-gray-900/30' 
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            variants={userCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={2}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isDark ? 'bg-purple-900' : 'bg-purple-100'
            }`}>
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Book className={isDark ? 'text-purple-400' : 'text-purple-600'} size={24} />
              </motion.div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : ''
            }`}>Enseignants</h3>
            <p className={`mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Créez des cours, suivez les performances et motivez vos élèves.
            </p>
            <Link 
              href="/teacher" 
              className={`flex items-center text-sm font-medium ${
                isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
              }`}
            >
              Espace enseignant
              <motion.div
                className="ml-1"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </Link>
          </motion.div>

          {/* Admin */}
          <motion.div 
            className={`p-6 rounded-lg transition-shadow ${
              isDark 
                ? 'bg-gray-800 shadow-lg hover:shadow-xl shadow-gray-900/30' 
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            variants={userCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={3}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isDark ? 'bg-orange-900' : 'bg-orange-100'
            }`}>
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Laptop className={isDark ? 'text-orange-400' : 'text-orange-600'} size={24} />
              </motion.div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : ''
            }`}>Administration</h3>
            <p className={`mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Gérez les utilisateurs, les cours et les badges de la plateforme.
            </p>
            <Link 
              href="/admin" 
              className={`flex items-center text-sm font-medium ${
                isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'
              }`}
            >
              Espace admin
              <motion.div
                className="ml-1"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Features Section with Scroll Animation */}
        <motion.div 
          ref={featuresRef}
          className="mt-32"
          variants={featureVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h2 
            className={`text-3xl font-bold text-center mb-12 ${
              isDark ? 'text-white' : ''
            }`}
            variants={itemVariants}
          >
            Fonctionnalités principales
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              className="text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Book className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : ''
              }`}>
                Apprentissage interactif
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Des cours interactifs et adaptés au programme de CM2.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-green-900' : 'bg-green-100'
              }`}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : ''
              }`}>
                Système de badges
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Des récompenses pour motiver et valoriser les progrès.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}>
                <motion.div
                  animate={{ 
                    y: [0, -5, 0, 5, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                  </svg>
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : ''
              }`}>
                Suivi personnalisé
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Suivez les progrès en temps réel et identifiez les points à améliorer.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Marquee/Scrolling Element - Student Achievements */}
        <motion.div 
          className={`mt-24 py-8 rounded-xl overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gradient-to-r from-blue-50 via-white to-blue-50'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className={`text-center text-xl font-semibold mb-6 ${
            isDark ? 'text-white' : ''
          }`}>
            Nos élèves progressent chaque jour
          </h3>
          
          <div className="relative">
            <motion.div
              className="flex space-x-6 py-2"
              animate={{ x: [0, -1000] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...Array(10)].map((_, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-3 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : ''}`}>
                      Élève {index + 1}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {index % 3 === 0 ? "A terminé un exercice de mathématiques" : 
                       index % 3 === 1 ? "A obtenu un badge de français" : 
                       "A progressé de 15% en sciences"}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Duplicate for seamless infinite scroll */}
            <motion.div
              className="flex space-x-6 py-2 absolute top-0"
              initial={{ x: 1000 }}
              animate={{ x: [1000, 0] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...Array(10)].map((_, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-3 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : ''}`}>
                      Élève {index + 11}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {index % 3 === 0 ? "A terminé un exercice de mathématiques" : 
                       index % 3 === 1 ? "A obtenu un badge de français" : 
                       "A progressé de 15% en sciences"}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Floating Call-to-Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block py-4 px-8 bg-blue-600 text-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <h3 className="text-xl font-bold mb-2">Prêt à commencer l'aventure ?</h3>
            <p className="mb-4">Rejoignez notre plateforme dès aujourd'hui</p>
            <Link href="/auth/register" className="inline-block px-6 py-2 bg-white text-blue-600 rounded-md font-medium">
              S'inscrire gratuitement
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

//---------------

// // app/page.tsx
// import React from 'react';
// import Link from 'next/link';
// import { Laptop, Book, Users, User, ChevronRight } from 'lucide-react';

//  export default  function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       {/* Navbar */}
//       <nav className="border-b bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <span className="text-blue-600 font-bold text-2xl">eCEP</span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
//                 Connexion
//               </Link>
//               <Link href="/auth/register" className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
//                 S'inscrire
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//             <span className="block">Bienvenue sur </span>
//             <span className="block text-blue-600">eCEP</span>
//           </h1>
//           <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
//             Une plateforme d'apprentissage interactive pour les élèves de CM2,
//             conçue pour motiver et suivre les progrès.
//           </p>
//           <div className="mt-10 flex justify-center">
//             <Link href="/auth/login-register" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg">
//               Commencer maintenant
//             </Link>
//             <a href="#features" className="ml-4 px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:text-lg">
//               En savoir plus
//             </a>
//           </div>
//         </div>

//         {/* User Type Selection */}
//         <div id="features" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-20">
//           {/* Élève */}
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
//               <User className="text-blue-600" size={24} />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Élèves</h3>
//             <p className="text-gray-600 mb-4">
//               Accédez à vos cours, gagnez des badges et suivez votre progression.
//             </p>
//             <Link href="/student" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
//               Espace élève
//               <ChevronRight size={16} className="ml-1" />
//             </Link>
//           </div>

//           {/* Parent */}
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
//               <Users className="text-green-600" size={24} />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Parents</h3>
//             <p className="text-gray-600 mb-4">
//               Suivez les progrès de vos enfants et restez informés de leur parcours scolaire.
//             </p>
//             <Link href="/parent" className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium">
//               Espace parent
//               <ChevronRight size={16} className="ml-1" />
//             </Link>
//           </div>

//           {/* Enseignant */}
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
//               <Book className="text-purple-600" size={24} />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Enseignants</h3>
//             <p className="text-gray-600 mb-4">
//               Créez des cours, suivez les performances et motivez vos élèves.
//             </p>
//             <Link href="/teacher" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium">
//               Espace enseignant
//               <ChevronRight size={16} className="ml-1" />
//             </Link>
//           </div>

//           {/* Admin */}
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
//               <Laptop className="text-orange-600" size={24} />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Administration</h3>
//             <p className="text-gray-600 mb-4">
//               Gérez les utilisateurs, les cours et les badges de la plateforme.
//             </p>
//             <Link href="/admin" className="text-orange-600 hover:text-orange-800 flex items-center text-sm font-medium">
//               Espace admin
//               <ChevronRight size={16} className="ml-1" />
//             </Link>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="mt-32">
//           <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Book className="text-blue-600" size={28} />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Apprentissage interactif</h3>
//               <p className="text-gray-600">
//                 Des cours interactifs et adaptés au programme de CM2.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-600">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Système de badges</h3>
//               <p className="text-gray-600">
//                 Des récompenses pour motiver et valoriser les progrès.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-600">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Suivi personnalisé</h3>
//               <p className="text-gray-600">
//                 Suivez les progrès en temps réel et identifiez les points à améliorer.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }