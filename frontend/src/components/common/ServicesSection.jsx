import React from 'react';
import { useTranslation } from 'react-i18next';

const ICONS = ['🪴', '👥', '🌐'];

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
  const { t } = useTranslation();
  const services = t('services.items', { returnObjects: true });

  return (
    <section className="bg-white py-24 px-6 relative mt-12 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-primary-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          {t('services.title')}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
          {t('services.subtitle')}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(services) && services.map((service, idx) => (
            <ServiceCard key={service.title} icon={ICONS[idx]} title={service.title} desc={service.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
