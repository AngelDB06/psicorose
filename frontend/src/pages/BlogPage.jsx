import React from 'react';
import { useState } from 'react';
import PostCard from '../components/common/PostCard';
import MOCK_POSTS from '../data/mockPosts';

const CATEGORIES = ['Todos', ...new Set(MOCK_POSTS.map((p) => p.category))];

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredPosts =
    activeCategory === 'Todos'
      ? MOCK_POSTS
      : MOCK_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header del blog */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-primary-100 text-sm font-semibold rounded-full backdrop-blur-sm mb-6">
            📝 Blog de PsicoRose
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Artículos y Reflexiones
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Recursos, consejos y reflexiones de la Dra. Rosa María para acompañarte en tu camino hacia el bienestar emocional.
          </p>
        </div>
      </section>

      {/* Filtro de categorías */}
      <div className="max-w-7xl mx-auto px-6 -mt-5">
        <div className="bg-white rounded-2xl shadow-md border border-primary-50 p-2 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de posts */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No hay artículos en esta categoría todavía.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogPage;
