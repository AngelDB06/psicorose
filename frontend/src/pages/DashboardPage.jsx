import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmada',  classes: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelada',   classes: 'bg-red-100 text-red-600 border-red-200' },
  completed: { label: 'Completada',  classes: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function DashboardPage() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [cancellingId, setCancellingId] = useState(null);

  // Limpiar el successMessage después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Cargar citas del usuario
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
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'cancelled' || a.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Cabecera del Dashboard */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-200/50">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                ¡Hola, {user?.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-500 mt-1">Bienvenido/a a tu panel personal.</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-100 text-red-500 font-semibold hover:bg-red-50 transition-colors w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

        {/* Grid principal */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Columna Izquierda (Ancha) */}
          <div className="md:col-span-2 space-y-8">

            {/* Próximas Citas */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Mis Próximas Citas
                  {upcomingAppointments.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                      {upcomingAppointments.length}
                    </span>
                  )}
                </h2>
                <Link to="/reservar" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva cita
                </Link>
              </div>

              {loadingAppts ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-slate-500 mb-4 font-medium">Aún no tienes citas programadas.</p>
                  <Link
                    to="/reservar"
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-primary-200/50"
                  >
                    Reservar mi primera cita
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appt) => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <div key={appt._id} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-100 transition-all">
                        {/* Fecha */}
                        <div className="text-center bg-primary-500 text-white rounded-2xl px-4 py-3 min-w-[64px] shadow-sm">
                          <p className="text-xl font-bold leading-none">{new Date(appt.date).getDate()}</p>
                          <p className="text-xs font-semibold uppercase opacity-80">
                            {new Date(appt.date).toLocaleDateString('es-ES', { month: 'short' })}
                          </p>
                        </div>

                        {/* Detalles */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{appt.reason}</p>
                          <p className="text-sm text-slate-500">{appt.time}h · {formatDate(appt.date)}</p>
                        </div>

                        {/* Estado y cancelar */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.classes}`}>
                            {statusCfg.label}
                          </span>
                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(appt._id)}
                              disabled={cancellingId === appt._id}
                              className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-50"
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

            {/* Historial de citas */}
            {pastAppointments.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary-50">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Historial</h2>
                <div className="space-y-3">
                  {pastAppointments.map((appt) => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <div key={appt._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 opacity-70">
                        <div className="text-center bg-slate-300 text-white rounded-xl px-3 py-2 min-w-[52px]">
                          <p className="text-base font-bold leading-none">{new Date(appt.date).getDate()}</p>
                          <p className="text-xs font-semibold uppercase">
                            {new Date(appt.date).toLocaleDateString('es-ES', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-600 text-sm truncate">{appt.reason}</p>
                          <p className="text-xs text-slate-400">{appt.time}h</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.classes}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha (Estrecha) */}
          <div className="space-y-8">

            {/* Resumen de Perfil */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary-50">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Mis Datos</h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</span>
                  <p className="font-medium text-slate-700">{user?.name}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</span>
                  <p className="font-medium text-slate-700">{user?.email}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Teléfono</span>
                  <p className="font-medium text-slate-700">{user?.phone || 'No especificado'}</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-primary-600 transition-colors text-sm">
                Editar Perfil
              </button>
            </div>

            {/* Acceso Blog */}
            <Link to="/blog" className="block bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-white font-bold text-xl mb-2 relative z-10">Artículos Recomendados</h2>
              <p className="text-primary-100 text-sm mb-4 relative z-10">
                Lee los últimos consejos de la Dra. Rosa para tu bienestar emocional.
              </p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold group-hover:translate-x-1 transition-transform relative z-10">
                Ir al Blog
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
