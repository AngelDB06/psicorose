import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-rosa', label: 'Sobre la Dra. Rosa' },
  { to: '/blog', label: 'Blog' },
];

function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
