import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-primary-200">
      {/* Navbar Minimalista */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary-100 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            R
          </div>
          <span className="text-2xl font-bold text-primary-900 tracking-tight">PsicoRose</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="text-primary-600 border-b-2 border-primary-500 pb-1">Inicio</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Sobre la Dra. Rosa</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Blog</a>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full transition-all shadow-sm shadow-primary-200">
            Reservar Cita
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 overflow-hidden">
        {/* Columna Texto */}
        <div className="flex-1 space-y-6 z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full border border-primary-100">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Orientación Psicológica Profesional
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800">
            Un espacio seguro para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">bienestar emocional</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed md:max-w-xl">
            Da el primer paso hacia una vida más plena y consciente. En nuestra consulta encontrarás un enfoque centrado en ti, desde un entorno de máxima confianza y empatía.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200/50 hover:shadow-primary-300 hover:-translate-y-0.5">
              Comenzar tu Terapia
            </button>
            <button className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 px-8 py-3.5 rounded-full font-semibold border border-primary-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <span className="text-xl">🤖</span> Asistente IA Inicial
            </button>
          </div>
        </div>

        {/* Columna Imagen */}
        <div className="flex-1 w-full relative z-10">
          {/* Formas suaves de fondo (Glassmorphism blobs) */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

          <img
            src="/hero_office.png"
            alt="Entorno seguro y calmado"
            className="relative z-10 w-full h-[450px] object-cover rounded-[2.5rem] shadow-2xl border-8 border-white transform transition-transform hover:scale-[1.02] duration-500"
          />

          {/* Tarjeta flotante simulando una métrica de IA o notificación */}
          <div className="absolute bottom-10 -left-10 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-primary-50 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-primary-100 p-2 rounded-full">
              📅
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Cita más próxima</p>
              <p className="text-sm text-primary-900 font-bold">Mañana, 10:30 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Features abstract */}
      <section className="bg-white py-24 px-6 relative mt-12 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-primary-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">¿Cómo podemos ayudarte?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
            Ofrecemos espacios de terapia adaptados a tus necesidades clínicas, basados en el respeto mutuo, la escucha activa y el rigor profesional.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🪴', title: 'Terapia Individual', desc: 'Acompañamiento personalizado para abordar ansiedad, estrés, gestión emocional y autoconocimiento.' },
              { icon: '👥', title: 'Terapia de Pareja', desc: 'Reconstruye la comunicación y el bienestar afectivo de tu relación en un entorno seguro y neutral.' },
              { icon: '🌐', title: 'Consultas Online', desc: 'A través de nuestra plataforma, recibe atención psicológica ininterrumpida desde cualquier lugar del mundo.' }
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-3xl bg-primary-50/50 border border-primary-100 hover:bg-primary-50 transition-colors text-left group cursor-default">
                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm text-primary-500 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
