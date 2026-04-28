import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-rosa', label: 'Sobre la Dra. Rosa' },
  { to: '/opiniones', label: 'Opiniones' },
  { to: '/blog', label: 'Blog' },
];

function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary-100">
      <div className="flex items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="PsicoRosa Logo" className="w-14 h-14 rounded-full object-cover shadow-[0_0_8px_rgba(0,0,0,0.25)]" />
          <span className="text-3xl font-bold text-primary-900 tracking-tight">PsicoRose</span>
        </Link>

        {/* Links de escritorio */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={
                pathname === to
                  ? 'text-primary-600 border-b-2 border-primary-500 pb-1'
                  : 'hover:text-primary-500 transition-colors'
              }
            >
              {label}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 ml-2 border-l border-primary-100 pl-6">
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="text-primary-700 hover:text-primary-800 font-bold transition-colors">
                  Panel de Dra. Rosa
                </Link>
              ) : (
                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-semibold transition-colors">
                  Mi Panel
                </Link>
              )}
              <div className="flex items-center gap-3">
                <Link to="/perfil" className="flex items-center gap-3 group">
                  <span className="hidden lg:block text-sm font-bold text-primary-900 bg-primary-50 px-3 py-1.5 rounded-full group-hover:bg-primary-100 transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-200 group-hover:border-primary-400 transition-all shadow-sm bg-primary-50 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-600 font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Iniciar Sesión
              </Link>
              <Link
                to="/reservar"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full transition-all shadow-sm shadow-primary-200"
              >
                Reservar Cita
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-primary-700 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-primary-700 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-primary-700 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-72 border-t border-primary-100' : 'max-h-0'}`}>
        <div className="flex flex-col gap-2 px-6 py-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-semibold rounded-lg px-3 transition-colors ${pathname === to
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
            >
              {label}
            </Link>
          ))}
          
          {user ? (
            <div className="mt-4 pt-4 border-t border-primary-100 flex flex-col gap-2">
              {user.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-bold rounded-lg px-3 transition-colors text-primary-700 hover:bg-primary-50 hover:text-primary-800"
                >
                  Panel de Dra. Rosa
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-semibold rounded-lg px-3 transition-colors text-slate-600 hover:bg-primary-50 hover:text-primary-600"
                >
                  Mi Panel ({user.name.split(' ')[0]})
                </Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="py-2 text-sm font-semibold rounded-lg px-3 text-left text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold rounded-lg px-3 transition-colors text-slate-600 hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Iniciar Sesión
              </Link>
              <Link
                to="/reservar"
                onClick={() => setMenuOpen(false)}
                className="mt-2 text-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full transition-all font-semibold text-sm"
              >
                Reservar Cita
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
