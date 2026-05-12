import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ICONS = ['🪴', '👥', '🌐'];

function ServiceCard({ icon, title, desc, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ 
        y: -10, 
        backgroundColor: "rgba(255, 255, 255, 1)",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)"
      }}
      className="p-10 rounded-[2.5rem] bg-white/50 border border-primary-50 backdrop-blur-sm transition-all text-left group cursor-pointer relative overflow-hidden"
    >
      {/* Círculo decorativo de fondo al pasar el ratón */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-150" />
      
      <div className="text-4xl mb-8 bg-gradient-to-br from-primary-50 to-primary-100 w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </div>
      
      <h3 className="text-2xl font-black mb-4 text-slate-800 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-600 leading-relaxed font-medium">
        {desc}
      </p>

      <div className="mt-8 flex items-center gap-2 text-primary-500 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
        Saber más 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </motion.div>
  );
}

function ServicesSection() {
  const { t } = useTranslation();
  const services = t('services.items', { returnObjects: true });

  return (
    <section className="bg-slate-50/50 py-32 px-6 relative mt-12 rounded-[4rem] border-t border-white overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block">
            Nuestra Consulta
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
            {t('services.title')}
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-20 font-medium">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {Array.isArray(services) && services.map((service, idx) => (
            <ServiceCard 
              key={service.title} 
              index={idx}
              icon={ICONS[idx]} 
              title={service.title} 
              desc={service.desc} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
