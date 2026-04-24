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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border border-white/30">
              🌹
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-primary-100 mt-1">Gestión de clínica y pacientes</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors font-semibold flex items-center gap-2 w-fit"
          >
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-semibold">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Menú lateral */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-bold flex items-center gap-3">
                  <span>📅</span> Gestión de Citas
                </button>
                <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold flex items-center gap-3 transition-colors opacity-50 cursor-not-allowed" title="Próximamente">
                  <span>📝</span> Blog (Pronto)
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="md:col-span-3 space-y-8">
            
            {/* Próximas citas */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Citas Pendientes / Confirmadas
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                  {upcomingAppointments.length}
                </span>
              </h2>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No hay citas próximas programadas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-sm uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Fecha / Hora</th>
                        <th className="pb-3 font-semibold">Paciente</th>
                        <th className="pb-3 font-semibold">Motivo</th>
                        <th className="pb-3 font-semibold text-center">Estado</th>
                        <th className="pb-3 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {upcomingAppointments.map((appt) => {
                        const date = new Date(appt.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                        const status = STATUS_CONFIG[appt.status];
                        
                        return (
                          <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 font-semibold text-slate-700">{date} <span className="text-slate-400 font-normal">| {appt.time}</span></td>
                            <td className="py-4">
                              <p className="font-bold text-slate-800">{appt.user?.name || 'Usuario borrado'}</p>
                              <p className="text-xs text-slate-500">{appt.user?.phone} · {appt.user?.email}</p>
                            </td>
                            <td className="py-4 text-sm text-slate-600 font-medium">{appt.reason}</td>
                            <td className="py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${status.classes}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <select
                                className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={appt.status}
                                onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmar</option>
                                <option value="completed">Completar</option>
                                <option value="cancelled">Cancelar</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Historial */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 opacity-80">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Historial de citas</h2>
              {pastAppointments.length === 0 ? (
                <p className="text-slate-500 text-sm">No hay historial disponible.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Fecha</th>
                        <th className="pb-3 font-semibold">Paciente</th>
                        <th className="pb-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pastAppointments.map((appt) => {
                        const status = STATUS_CONFIG[appt.status];
                        return (
                          <tr key={appt._id}>
                            <td className="py-3 text-slate-600">{new Date(appt.date).toLocaleDateString('es-ES')}</td>
                            <td className="py-3 font-semibold text-slate-700">{appt.user?.name}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status.classes}`}>
                                {status.label}
                              </span>
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
