import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AVAILABLE_TIMES = ['16:00', '17:00', '18:00', '19:00'];

const getMinDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

function BookingPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const { t, i18n } = useTranslation();

  const consultationTypes = t('booking.consultation_types', { returnObjects: true });
  const dayNames          = t('booking.days',               { returnObjects: true });

  const [formData, setFormData] = useState({ date: '', time: '', reason: '', notes: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.reason) {
      return setError(t('booking.fill_all'));
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al reservar la cita');
      navigate('/dashboard', { state: { successMessage: t('booking.success_message') } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return Array.isArray(dayNames) ? dayNames[d.getDay()] : '';
  };

  const locale = i18n.language.startsWith('en') ? 'en-GB' : 'es-ES';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 py-12 px-6">
      <div className="fixed top-20 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        {/* Cabecera */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg shadow-primary-200/50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{t('booking.title')}</h1>
          <p className="text-slate-500 mt-2">
            {t('booking.greeting')} <span className="font-semibold text-primary-600">{user?.name.split(' ')[0]}</span>. {t('booking.greeting_suffix')}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-primary-100 p-8 md:p-10 space-y-8">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Paso 1: Tipo de consulta */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                {t('booking.step1')} <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.isArray(consultationTypes) && consultationTypes.map((type) => (
                  <button
                    key={type} type="button"
                    onClick={() => setFormData({ ...formData, reason: type })}
                    className={`p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all ${
                      formData.reason === type
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-100'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    <span className={`block w-5 h-5 rounded-full border-2 mb-2 transition-all ${
                      formData.reason === type ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                    }`} />
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                {t('booking.step2')} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </span>
                <input
                  id="date" name="date" type="date"
                  value={formData.date} onChange={handleChange}
                  min={getMinDate()} required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-slate-700 transition-all"
                />
              </div>
              {formData.date && (
                <p className="mt-2 text-sm text-primary-600 font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {getWeekDay(formData.date)}, {new Date(formData.date + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Paso 3: Hora */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                {t('booking.step3')} <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVAILABLE_TIMES.map((time) => (
                  <button
                    key={time} type="button"
                    onClick={() => handleTimeSelect(time)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      formData.time === time
                        ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-200/50 scale-105'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 4: Notas */}
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                {t('booking.step4')} <span className="text-slate-400 font-normal normal-case">{t('booking.optional')}</span>
              </label>
              <textarea
                id="notes" name="notes" value={formData.notes} onChange={handleChange}
                rows={3}
                placeholder="Cuéntanos brevemente qué te ha llevado a pedir cita..."
                className="w-full px-4 py-3 rounded-xl border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-slate-700 placeholder:text-slate-400 transition-all resize-none"
              />
            </div>

            {/* Resumen */}
            {formData.reason && formData.date && formData.time && (
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-primary-800 mb-3">{t('booking.summary_title')}</p>
                <div className="space-y-1 text-sm text-primary-700">
                  <p>📋 <span className="font-semibold">{formData.reason}</span></p>
                  <p>📅 {getWeekDay(formData.date)}, {new Date(formData.date + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p>🕐 {formData.time}h</p>
                </div>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary-200/50 text-lg ${
                loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-primary-300'
              }`}
            >
              {loading ? t('booking.submitting') : t('booking.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
