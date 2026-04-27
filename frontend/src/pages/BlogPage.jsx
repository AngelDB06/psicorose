import React, { useState, useEffect } from 'react';
import PostCard from '../components/common/PostCard';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Error al cargar los artículos');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = ['Todos', ...new Set(posts.map((p) => p.category))];

  const filteredPosts =
    activeCategory === 'Todos'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

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
      {!loading && !error && posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 -mt-5">
          <div className="bg-white rounded-2xl shadow-md border border-primary-50 p-2 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
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
      )}

      {/* Grid de posts */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 h-80 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No hay artículos publicados todavía.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogPage;
