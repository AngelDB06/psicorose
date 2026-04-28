import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ slug, image, category, title, excerpt, date, readTime }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-primary-50 shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col">
      {/* Imagen del post */}
      <div className="relative overflow-hidden h-52 bg-slate-100">
        <img
          src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200'; // Imagen de fallback
          }}
        />
        <span className="absolute top-4 left-4 bg-primary-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        {/* Fecha y lectura */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-3">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{readTime} min de lectura</span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
          {excerpt}
        </p>

        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-auto"
        >
          Leer más
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default PostCard;
