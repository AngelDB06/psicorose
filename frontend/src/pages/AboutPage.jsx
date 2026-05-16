import React from 'react';
import rosaImg from '../assets/rosa.jpg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PILLAR_ICONS = ['🎯', '🔬', '🤝', '🚀'];
const AUTOSUFICIENTES_KEY = 'AUTOSUFICIENTES';

function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const paragraphs = t('about.paragraphs', { returnObjects: true });
  const pillars    = t('about.pillars',    { returnObjects: true });

  const handleBooking = () => {
    if (isAuthenticated) {
      navigate('/reservar');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero de la página ── */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-300 to-white/30 scale-110 blur-sm" />
              <img
                src={rosaImg}
                alt="Rosa María Barranco Torres – Psicóloga"
                className="relative w-52 h-52 md:w-64 md:h-64 rounded-full object-cover object-top border-4 border-white/60 shadow-2xl"
              />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4">
            <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-primary-100 text-sm font-semibold rounded-full backdrop-blur-sm">
              {t('about.tag')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Rosa María<br />Barranco Torres
            </h1>
            <p className="text-primary-200 text-lg max-w-xl">
              Colegiada nº AO13759
            </p>
            <p className="text-primary-200 text-lg max-w-xl">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Cita destacada ── */}
      <section className="bg-white border-b border-primary-50">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <span className="text-5xl text-primary-300 leading-none font-serif">"</span>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2 mb-6">
            {t('about.quote_title')}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {t('about.quote_body')}
          </p>
        </div>
      </section>

      {/* ── Texto principal ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {Array.isArray(paragraphs) && paragraphs.map((text, i) => {
            // Último párrafo → estilo invitación
            if (i === paragraphs.length - 1) {
              return (
                <div key={i} className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 text-center">
                  <p className="text-primary-800 text-lg font-medium leading-relaxed italic">{text}</p>
                  <button
                    onClick={handleBooking}
                    className="mt-6 inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200/50 hover:-translate-y-0.5"
                  >
                    {t('about.book_cta')}
                  </button>
                </div>
              );
            }

            // Párrafo con AUTOSUFICIENTES → highlight
            if (text.includes(AUTOSUFICIENTES_KEY) || text.includes('SELF-SUFFICIENT')) {
              const keyword = text.includes(AUTOSUFICIENTES_KEY) ? AUTOSUFICIENTES_KEY : 'SELF-SUFFICIENT';
              return (
                <p key={i} className="text-slate-600 text-lg leading-relaxed">
                  {text.split(keyword).map((part, j, arr) => (
                    <React.Fragment key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <strong className="text-primary-700 font-bold">{keyword}</strong>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              );
            }

            return (
              <p key={i} className="text-slate-600 text-lg leading-relaxed">{text}</p>
            );
          })}
        </div>
      </section>

      {/* ── Valores / Pilares ── */}
      <section className="bg-white border-t border-primary-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 text-center mb-12">
            {t('about.work_title')}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.isArray(pillars) && pillars.map(({ label, desc }, idx) => (
              <div key={label} className="p-6 rounded-2xl bg-primary-50/50 border border-primary-100 hover:bg-primary-50 transition-colors group">
                <div className="text-3xl mb-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {PILLAR_ICONS[idx]}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;
