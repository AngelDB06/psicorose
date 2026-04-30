import React from 'react';
import heroImg from '../../assets/hero_office.jpg';
import { useTranslation } from 'react-i18next';

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      {/* Columna Texto */}
      <div className="flex-1 space-y-6 z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full border border-primary-100">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          {t('home.hero_tag')}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800">
          {t('home.hero_title_1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            {t('home.hero_title_2')}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed md:max-w-xl">
          {t('home.hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
          <button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200/50 hover:shadow-primary-300 hover:-translate-y-0.5">
            {t('home.book_now')}
          </button>
          <button className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 px-8 py-3.5 rounded-full font-semibold border border-primary-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
            <span className="text-xl">🤖</span> {t('home.ai_assistant')}
          </button>
        </div>
      </div>

      {/* Columna Imagen */}
      <div className="flex-1 w-full relative z-10">
        {/* Blobs de fondo */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        <img
          src={heroImg}
          alt="Entorno seguro y calmado"
          className="relative z-10 w-full h-[450px] object-cover rounded-[2.5rem] shadow-2xl border-8 border-white transform transition-transform hover:scale-[1.02] duration-500"
        />

        {/* Tarjeta flotante */}
        <div
          className="absolute bottom-10 -left-10 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-primary-50 flex items-center gap-4 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <div className="bg-primary-100 p-2 rounded-full">📅</div>
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-0.5">Cita más próxima</p>
            <p className="text-sm text-primary-900 font-bold">Mañana, 10:30 AM</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
