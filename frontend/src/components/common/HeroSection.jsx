import React from 'react';
import heroImg from '../../assets/hero_office.jpg';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function HeroSection() {
  const { t } = useTranslation();

  // Variantes para animaciones escalonadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-visible">
      {/* Elementos decorativos de fondo */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />
      
      {/* Columna Texto */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-8 z-10"
      >
        <motion.span 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-700 text-sm font-bold rounded-full border border-primary-100 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          {t('home.hero_tag')}
        </motion.span>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900"
        >
          {t('home.hero_title_1')}{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              {t('home.hero_title_2')}
            </span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-2 left-0 h-3 bg-primary-100 -z-10 rounded-full"
            />
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-600 leading-relaxed md:max-w-xl font-medium"
        >
          {t('home.hero_subtitle')}
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-5 pt-4"
        >
          <Link to="/reserva" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(var(--primary-500-rgb), 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-200/50 transition-colors hover:bg-primary-600"
            >
              {t('home.book_now')}
            </motion.button>
          </Link>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white text-slate-700 px-10 py-4 rounded-2xl font-bold text-lg border-2 border-slate-100 shadow-sm flex items-center justify-center gap-3 transition-all"
          >
            <span className="text-2xl">🤖</span> {t('home.ai_assistant')}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Columna Imagen */}
      <motion.div 
        initial={{ opacity: 0, x: 100, rotate: 5 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex-1 w-full relative"
      >
        {/* Decoración detrás de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-blue-200 rounded-[3rem] blur-2xl opacity-30 transform -rotate-6 translate-x-4 translate-y-4" />
        
        <div className="relative group">
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            src={heroImg}
            alt={t('home.hero_img_alt')}
            className="relative z-10 w-full h-[550px] object-cover rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border-[12px] border-white"
          />

          {/* Tarjeta flotante interactiva */}
          <motion.div 
            drag
            dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute -bottom-6 -left-8 z-20 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-primary-50 flex items-center gap-5 cursor-grab active:cursor-grabbing"
          >
            <div className="bg-primary-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📅</div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('home.next_appt_label')}</p>
              <p className="text-base text-slate-900 font-black">{t('home.next_appt_value')}</p>
            </div>
          </motion.div>

          {/* Elemento decorativo adicional */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -right-6 z-20 bg-primary-500 text-white p-4 rounded-2xl shadow-xl font-bold text-sm"
          >
            ⭐ 100% Personalizado
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
