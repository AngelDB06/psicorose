import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Importación de imágenes
import imgInfantil from '../../assets/psicoterapia-infantil.jpg';
import imgAdolescentes from '../../assets/terapia-adolescentes.jpg';
import imgAdultos from '../../assets/terapia-adultos.jpg';

const IMAGES = [imgInfantil, imgAdolescentes, imgAdultos];

function ServiceCard({ image, title, desc, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ 
        y: -12, 
        transition: { duration: 0.4 }
      }}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 cursor-default"
    >
      {/* Contenedor de Imagen con Efecto Zoom */}
      <div className="relative h-64 overflow-hidden">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        {/* Overlay degradado sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-8 md:p-10 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h3 className="text-2xl font-black text-slate-800 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
        </div>
        
        <p className="text-slate-600 leading-relaxed font-medium mb-6">
          {desc}
        </p>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-primary-500 font-bold text-sm uppercase tracking-wider group/btn"
        >
          Saber más 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

function ServicesSection() {
  const { t } = useTranslation();
  const services = t('services.items', { returnObjects: true });

  return (
    <section className="py-32 px-6 relative bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-primary-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block">
            Especialidades
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1.5 bg-primary-100 mx-auto rounded-full mb-8" />
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {Array.isArray(services) && services.map((service, idx) => (
            <ServiceCard 
              key={service.title} 
              index={idx}
              image={IMAGES[idx]} 
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
