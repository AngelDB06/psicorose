import React from 'react';
import rosaImg from '../assets/rosa.jpg';

const PARAGRAPHS = [
  `Del mismo modo que nuestras huellas dactilares nos hacen únicos aunque compartamos características físicas, las personas podemos compartir diagnósticos e incluso síntomas pero el origen de esos síntomas puede variar, por lo que el tratamiento debe adaptarse de manera individualizada a cada persona.`,
  `Es por esto que me gusta tratar a mis pacientes de manera personalizada, averiguando las particularidades de su caso y adaptando la terapia a sus necesidades. Mediante un enfoque integrativo en el que se tengan en cuenta todos los factores que pueden estar originando el problema o cronificándolo en el tiempo. Aplicando en cada caso las técnicas más idóneas y con mayor evidencia científica para su caso particular.`,
  `Aunque cada tratamiento sea diferente el compromiso que adquiero con mis pacientes es el mismo: ¡que no me necesiten más!, o que me necesiten lo menos posible, así de sencillo y de complejo a la vez, pero no imposible.`,
  `El fin último de mis terapias es, por tanto, que mis pacientes sean autónomos, capaces de lidiar con sus problemas, de autorregularse, de sostenerse a sí mismos en los malos momentos, que sean AUTOSUFICIENTES.`,
  `A menudo confundimos el hecho de tener que pedir ayuda psicológica con un síntoma de debilidad, sin embargo ser autosuficiente es saber proporcionarnos a nosotros mismos los recursos que necesitamos en cada momento por tanto, ¿qué mayor prueba de autosuficiencia puede haber que reconocer que tenemos un problema y proporcionarnos la ayuda necesaria acudiendo a un especialista?`,
  `Te invito a reflexionar sobre ello y si decides solicitar mis servicios será un placer ayudarte.`,
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero de la página ── */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

          {/* Foto de Rosa */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Anillo decorativo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-300 to-white/30 scale-110 blur-sm" />
              <img
                src={rosaImg}
                alt="Rosa María Barranco Torres – Psicóloga"
                className="relative w-52 h-52 md:w-64 md:h-64 rounded-full object-cover object-top border-4 border-white/60 shadow-2xl"
              />
            </div>
          </div>

          {/* Título e intro */}
          <div className="text-center md:text-left space-y-4">
            <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-primary-100 text-sm font-semibold rounded-full backdrop-blur-sm">
              Psicóloga Clínica · Col. nº XXXXX
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Rosa María<br />Barranco Torres
            </h1>
            <p className="text-primary-200 text-lg max-w-xl">
              Especialista en terapia individual e integrativa con enfoque centrado en la persona y la evidencia científica.
            </p>
          </div>

        </div>
      </section>

      {/* ── Cita destacada ── */}
      <section className="bg-white border-b border-primary-50">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <span className="text-5xl text-primary-300 leading-none font-serif">"</span>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2 mb-6">
            ¡No hay dos casos iguales!
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Cada persona es única y merece un tratamiento personalizado que respete sus particularidades.
          </p>
        </div>
      </section>

      {/* ── Texto principal ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {PARAGRAPHS.map((text, i) => {
            // Último párrafo → estilo de invitación destacado
            if (i === PARAGRAPHS.length - 1) {
              return (
                <div key={i} className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 text-center">
                  <p className="text-primary-800 text-lg font-medium leading-relaxed italic">
                    {text}
                  </p>
                  <a
                    href="/reservas"
                    className="mt-6 inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200/50 hover:-translate-y-0.5"
                  >
                    Solicitar cita
                  </a>
                </div>
              );
            }

            // Párrafo de "AUTOSUFICIENTES" → highlight de palabra clave
            if (text.includes('AUTOSUFICIENTES')) {
              return (
                <p key={i} className="text-slate-600 text-lg leading-relaxed">
                  {text.split('AUTOSUFICIENTES').map((part, j, arr) => (
                    <React.Fragment key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <strong className="text-primary-700 font-bold">AUTOSUFICIENTES</strong>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              );
            }

            return (
              <p key={i} className="text-slate-600 text-lg leading-relaxed">
                {text}
              </p>
            );
          })}
        </div>
      </section>

      {/* ── Valores / Pilares (mini cards) ── */}
      <section className="bg-white border-t border-primary-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 text-center mb-12">
            Mi forma de trabajar
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', label: 'Enfoque Integrativo', desc: 'Combino técnicas de distintas corrientes para adaptarme a cada caso.' },
              { icon: '🔬', label: 'Evidencia Científica', desc: 'Solo aplico procedimientos respaldados por la investigación actual.' },
              { icon: '🤝', label: 'Vínculo Terapéutico', desc: 'La relación de confianza es la base de cualquier proceso de cambio.' },
              { icon: '🚀', label: 'Autonomía del Paciente', desc: 'Mi objetivo es que no me necesites: darte herramientas propias.' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="p-6 rounded-2xl bg-primary-50/50 border border-primary-100 hover:bg-primary-50 transition-colors group">
                <div className="text-3xl mb-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {icon}
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
