import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${slug}`);
        if (!response.ok) throw new Error('Artículo no encontrado');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-6xl mb-6">🔍</span>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Artículo no encontrado</h1>
        <p className="text-slate-500 mb-8">{error || 'El artículo que buscas no existe o ha sido eliminado.'}</p>
        <Link
          to="/blog"
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-all"
        >
          Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Imagen de cabecera */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

        {/* Metadata sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-4xl mx-auto">
          <span className="inline-block bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Info del artículo */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 py-6 border-b border-primary-100 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <span className="font-semibold text-slate-700">Dra. Rosa Mª Barranco</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{post.readTime} min de lectura</span>
        </div>
      </div>

      {/* Contenido del artículo */}
      <article className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className={`text-slate-600 text-lg leading-relaxed ${
                i === 0 ? 'text-xl text-slate-700 font-medium' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA al final del artículo */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 text-center">
          <p className="text-primary-900 font-bold text-xl mb-2">¿Necesitas ayuda profesional?</p>
          <p className="text-slate-500 mb-6">
            Si este artículo te ha resonado y crees que necesitas apoyo, no dudes en contactarnos.
          </p>
          <Link
            to="/reservar"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200/50 hover:-translate-y-0.5"
          >
            Solicitar una cita
          </Link>
        </div>
      </article>

      {/* Botón volver */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Blog
        </Link>
      </div>
    </div>
  );
}

export default PostDetailPage;
