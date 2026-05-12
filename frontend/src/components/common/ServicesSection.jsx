import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Importación de imágenes
import imgInfantil from '../../assets/psicoterapia-infantil.jpg';
import imgAdolescentes from '../../assets/terapia-adolescentes.jpg';
import imgAdultos from '../../assets/terapia-adultos.jpg';

const IMAGES = [imgInfantil, imgAdolescentes, imgAdultos];

function ServiceCard({ image, title, desc, index, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-8 md:p-10 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h3 className="text-2xl font-black text-slate-800">
            {title}
          </h3>
        </div>

        <p className="text-slate-600 leading-relaxed font-medium mb-6">
          {desc}
        </p>

        <motion.button
          whileHover={{ x: 5 }}
          onClick={onOpen}
          className="flex items-center gap-2 text-primary-500 font-bold text-sm uppercase tracking-wider group/btn cursor-pointer"
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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const services = t('services.items', { returnObjects: true });
  const [selectedService, setSelectedService] = useState(null);

  const handleBooking = () => {
    setSelectedService(null);
    if (isAuthenticated) {
      navigate('/reservar');
    } else {
      navigate('/login');
    }
  };

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
              onOpen={() => setSelectedService({ ...service, image: IMAGES[idx] })}
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Servicio */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Contenido del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 z-30 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="overflow-y-auto">
                <div className="relative h-64 sm:h-80">
                  <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>

                <div className="p-8 sm:p-12">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                      {selectedService.desc}
                    </p>
                    <div className="w-16 h-1 bg-primary-200 mb-8 rounded-full" />
                    <p className="text-lg text-slate-700 leading-relaxed italic">
                      {selectedService.details}
                    </p>
                  </div>

                  <div className="mt-12 p-8 bg-primary-50 rounded-3xl border border-primary-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-primary-900 font-bold text-lg mb-1">¿Crees que este servicio es para ti?</p>
                      <p className="text-primary-700">Reserva tu primera sesión hoy mismo.</p>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200"
                    >
                      Reservar Cita
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ServicesSection;
