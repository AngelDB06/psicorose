import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmada',  classes: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelada',   classes: 'bg-red-100 text-red-600 border-red-200' },
  completed: { label: 'Completada',  classes: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function DashboardPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('psicorose_token');
        const response = await fetch('http://localhost:5000/api/appointments/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Error al cargar citas:', err);
      } finally {
        setLoadingAppts(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;

    setCancellingId(appointmentId);
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === appointmentId ? { ...a, status: 'cancelled' } : a))
        );
      }
    } catch (err) {
      console.error('Error al cancelar:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextAppt = upcomingAppointments[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-3xl text-sm font-black flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            {successMessage}
          </div>
        )}

        {/* Hero de Bienvenida */}
        <section className="relative bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-200/50 border-4 border-white flex-shrink-0">
              {user?.avatar ? (
                <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {t('dashboard.welcome')}, <span className="text-primary-600">{user?.name.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-slate-500 font-medium mt-2 text-lg">{t('dashboard.subtitle')}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link to="/perfil" className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black hover:bg-slate-200 transition-colors">{t('nav.profile').toUpperCase()}</Link>
                <button onClick={logout} className="px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-black hover:bg-red-100 transition-colors">{t('nav.logout').toUpperCase()}</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative z-10 min-w-[200px]">
            <Link to="/reservar" className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              {t('dashboard.new_appointment')}
            </Link>
            <button 
              onClick={() => {
                const token = localStorage.getItem('psicorose_token');
                window.open(`http://localhost:5000/api/reports/appointments?token=${token}`, '_blank');
              }}
              className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('dashboard.download_report')}
            </button>
          </div>
        </section>

        {/* Contenido Dinámico */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Próximas Sesiones */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Cita más cercana destacada */}
            {nextAppt && (
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-primary-100 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase">Tu Próxima Sesión</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  </div>
                  <h3 className="text-3xl font-black mb-2">{formatDate(nextAppt.date)}</h3>
                  <p className="text-primary-100 text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {nextAppt.time} horas
                  </p>
                  <p className="mt-8 text-primary-200 font-medium italic opacity-80">"{nextAppt.reason}"</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-primary-500 rounded-full"></span>
                Agenda de Sesiones
              </h2>

              {loadingAppts ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                  <span className="text-5xl block mb-4">🧘‍♂️</span>
                  <p className="text-slate-500 font-bold">No tienes más citas pendientes en este momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appt) => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <div key={appt._id} className="flex items-center gap-6 p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-lg hover:shadow-primary-100/30 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex flex-col items-center justify-center font-black shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <span className="text-lg leading-none">{new Date(appt.date).getDate()}</span>
                          <span className="text-[10px] uppercase">{new Date(appt.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-slate-800 group-hover:text-primary-700 transition-colors">{appt.reason}</p>
                          <p className="text-sm font-bold text-slate-400 mt-0.5">{appt.time}h · {formatDate(appt.date).split(',')[0]}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusCfg.classes}`}>
                            {statusCfg.label}
                          </span>
                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(appt._id)}
                              disabled={cancellingId === appt._id}
                              className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                            >
                              {cancellingId === appt._id ? 'Cancelando...' : 'Cancelar'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lateral */}
          <div className="space-y-10">
            
            {/* Mis Datos */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Mi Perfil</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nombre</p>
                    <p className="font-bold text-slate-700">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                    <p className="font-bold text-slate-700 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Teléfono</p>
                    <p className="font-bold text-slate-700">{user?.phone || 'Sin especificar'}</p>
                  </div>
                </div>
              </div>
              <Link to="/perfil" className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-colors flex items-center justify-center">
                Editar Datos
              </Link>
            </div>

            {/* Sugerencia Blog */}
            <div className="bg-primary-50 rounded-[2.5rem] p-8 border border-primary-100 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🍃</span>
              <h3 className="text-lg font-black text-primary-900 leading-tight mb-2">Reflexiona y crece</h3>
              <p className="text-sm font-medium text-primary-700/70 mb-6">¿Has leído ya los últimos artículos de Rosa? Podrían ayudarte hoy.</p>
              <Link to="/blog" className="px-6 py-2.5 bg-white text-primary-600 rounded-full font-black text-xs uppercase tracking-widest shadow-sm border border-primary-100 hover:bg-primary-600 hover:text-white transition-all">Leer Blog</Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
