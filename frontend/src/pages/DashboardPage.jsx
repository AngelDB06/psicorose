import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
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
                </h2>
                <Link to="/reservar" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  + Nueva cita
                </Link>
              </div>

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
            </div>

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
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
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
