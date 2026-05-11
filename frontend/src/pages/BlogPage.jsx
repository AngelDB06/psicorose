import React, { useState, useEffect } from 'react';
import PostCard from '../components/common/PostCard';
import { useTranslation } from 'react-i18next';

function BlogPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(t('blog.all'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
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

  // Reset active category when language changes so "Todos"/"All" stays in sync
  useEffect(() => {
    setActiveCategory(t('blog.all'));
  }, [t]);

  const allLabel = t('blog.all');
  const categories = [allLabel, ...new Set(posts.map((p) => p.category))];

  const filteredPosts =
    activeCategory === allLabel
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header del blog */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-primary-100 text-sm font-semibold rounded-full backdrop-blur-sm mb-6">
            {t('blog.tag')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            {t('blog.subtitle')}
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
            <p className="text-slate-400 text-lg">{t('blog.empty')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogPage;
