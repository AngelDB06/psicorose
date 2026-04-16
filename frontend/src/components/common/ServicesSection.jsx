import React from 'react';

const SERVICES = [
  {
    icon: '🪴',
    title: 'Terapia Individual',
    desc: 'Acompañamiento personalizado para abordar ansiedad, estrés, gestión emocional y autoconocimiento.',
  },
  {
    icon: '👥',
    title: 'Terapia de Pareja',
    desc: 'Reconstruye la comunicación y el bienestar afectivo de tu relación en un entorno seguro y neutral.',
  },
  {
    icon: '🌐',
    title: 'Consultas Online',
    desc: 'A través de nuestra plataforma, recibe atención psicológica ininterrumpida desde cualquier lugar del mundo.',
  },
];

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-primary-50/50 border border-primary-100 hover:bg-primary-50 transition-colors text-left group cursor-default">
      <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm text-primary-500 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="bg-white py-24 px-6 relative mt-12 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-primary-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          ¿Cómo podemos ayudarte?
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
          Ofrecemos espacios de terapia adaptados a tus necesidades clínicas, basados en el
          respeto mutuo, la escucha activa y el rigor profesional.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
