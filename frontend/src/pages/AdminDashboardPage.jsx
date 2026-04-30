import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmada',  classes: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelada',   classes: 'bg-red-100 text-red-600 border-red-200' },
  completed: { label: 'Completada',  classes: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function AdminDashboardPage() {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al cargar las citas');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAppointments(appointments.map(appt => 
          appt._id === id ? { ...appt, status: newStatus } : appt
        ));
      } else {
        alert('Error al actualizar el estado de la cita');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
  
  // Estadísticas rápidas
  const today = new Date().toLocaleDateString('es-ES');
  const todayAppts = appointments.filter(a => new Date(a.date).toLocaleDateString('es-ES') === today && a.status !== 'cancelled').length;
  const pendingConfirm = appointments.filter(a => a.status === 'pending').length;
  const totalCompleted = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cabecera Superior */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Panel de Administración</h1>
              <p className="text-slate-500 font-medium">Psicóloga Rosa María Barranco</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              className="p-2.5 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              title="Refrescar datos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm border border-red-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold animate-pulse text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hoy</p>
              <h3 className="text-2xl font-black text-slate-900">{todayAppts} citas</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Por Confirmar</p>
              <h3 className="text-2xl font-black text-slate-900">{pendingConfirm} pendientes</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Finalizadas</p>
              <h3 className="text-2xl font-black text-slate-900">{totalCompleted} totales</h3>
            </div>
          </div>

          <div className="bg-primary-600 p-6 rounded-3xl shadow-lg shadow-primary-200 flex items-center gap-5 group hover:-translate-y-1 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Blog</p>
              <Link to="/admin/blog" className="text-xl font-black text-white hover:underline underline-offset-4">Ir al Blog</Link>
            </div>
          </div>
        </div>

        {/* Listado de Citas */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
              Próximas Sesiones
            </h2>
            <span className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-2xl text-sm font-black">
              {upcomingAppointments.length} citas activas
            </span>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-20 bg-white">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🍃</div>
                <h3 className="text-lg font-bold text-slate-700">No hay citas pendientes</h3>
                <p className="text-slate-400">Todo el calendario está al día.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-widest font-black border-b border-slate-100">
                      <th className="px-8 py-5">Fecha y Hora</th>
                      <th className="px-8 py-5">Paciente</th>
                      <th className="px-8 py-5">Motivo</th>
                      <th className="px-8 py-5 text-center">Estado</th>
                      <th className="px-8 py-5 text-right">Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {upcomingAppointments.map((appt) => {
                      const date = new Date(appt.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
                      const status = STATUS_CONFIG[appt.status];
                      
                      return (
                        <tr key={appt._id} className="group hover:bg-slate-50/80 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-extrabold">{date}</span>
                              <span className="text-primary-600 font-bold text-sm">{appt.time}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-100">
                                {appt.user?.avatar ? (
                                  <img src={`http://localhost:5000${appt.user.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  appt.user?.name?.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-900 font-bold">{appt.user?.name || 'Usuario'}</span>
                                <span className="text-slate-400 text-xs">{appt.user?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-slate-600 text-sm italic max-w-xs truncate">"{appt.reason}"</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`px-3 py-1.5 rounded-2xl text-[10px] uppercase tracking-widest font-black border ${status.classes}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="relative inline-block">
                              <select
                                className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                                value={appt.status}
                                onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmar</option>
                                <option value="completed">Completar</option>
                                <option value="cancelled">Cancelar</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Historial en cuadrícula compacta */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
              Sesiones Finalizadas
            </h2>
            <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <p className="text-slate-400 italic text-sm py-4">No hay registros pasados.</p>
              ) : (
                pastAppointments.slice(0, 5).map((appt) => (
                  <div key={appt._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
                        {new Date(appt.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </div>
                      <span className="font-bold text-slate-700">{appt.user?.name}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_CONFIG[appt.status].classes}`}>
                      {STATUS_CONFIG[appt.status].label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-primary-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Recuerda, Rosa...</h3>
              <p className="text-primary-50 text-lg leading-relaxed italic">
                "Cada sesión es un paso hacia la libertad emocional. Tu labor transforma vidas."
              </p>
            </div>
            <div className="flex justify-between items-end mt-12 relative z-10">
              <div>
                <p className="text-primary-200 text-sm font-bold uppercase tracking-widest">Estado del Sistema</p>
                <p className="flex items-center gap-2 text-sm font-bold mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Conectado y Seguro
                </p>
              </div>
              <span className="text-4xl opacity-50">🧘‍♀️</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;
