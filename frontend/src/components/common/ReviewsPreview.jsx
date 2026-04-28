import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.slice(0, 3)); // Solo mostramos las 3 primeras
        }
      } catch (err) {
        console.error('Error al cargar opiniones:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Lo que dicen mis <span className="text-primary-600">pacientes</span></h2>
            <p className="text-lg text-slate-600 max-w-xl">
              La confianza y el bienestar de quienes acuden a consulta son mi mayor prioridad.
            </p>
          </div>
          <Link to="/opiniones" className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center gap-2 group">
            Ver todas las opiniones 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-3xl animate-pulse"></div>)
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-primary-100 transition-colors">
                <div className="text-amber-400 mb-4 text-xs tracking-widest">
                  {'⭐'.repeat(review.rating)}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">
                  "{review.comment}"
                </p>
                <p className="font-bold text-slate-900">{review.user?.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewsPreview;
