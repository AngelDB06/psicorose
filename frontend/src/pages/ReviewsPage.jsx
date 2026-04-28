import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasSessions, setHasSessions] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error al cargar opiniones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSessions = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch('http://localhost:5000/api/appointments/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const appointments = await response.json();
        const completed = appointments.some(a => a.status === 'completed');
        setHasSessions(completed);
      }
    } catch (err) {
      console.error('Error al verificar sesiones:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchReviews();
    checkSessions();
  }, [fetchReviews, checkSessions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Gracias por tu opinión!');
        setComment('');
        setRating(5);
        setReviews([data, ...reviews]);
      } else {
        setError(data.message || 'Error al publicar la opinión');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return '⭐'.repeat(count);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Cabecera */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Opiniones de <span className="text-primary-600">Pacientes</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            La experiencia de quienes han confiado en la Dra. Rosa María Barranco para su bienestar emocional.
          </p>
        </div>

        {/* Formulario de Opinión */}
        {user ? (
          hasSessions ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>✍️</span> Deja tu testimonio
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Puntuación</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`w-12 h-12 rounded-xl text-xl transition-all ${
                          rating >= num ? 'bg-primary-500 text-white scale-110 shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-400 grayscale'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Tu experiencia</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos cómo te ha ayudado la terapia..."
                    rows="4"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 text-slate-700 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                {success && <p className="text-green-500 text-sm font-semibold">{success}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Publicando...' : 'Publicar opinión'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-3xl p-8 text-center border border-amber-100">
              <p className="text-amber-800 font-semibold">
                ⚠️ Solo puedes dejar una opinión después de haber completado al menos una sesión con la Dra. Rosa.
              </p>
              <p className="text-amber-600 text-sm mt-2">
                Tu opinión es muy valiosa para nosotros, ¡te esperamos en consulta!
              </p>
            </div>
          )
        ) : (
          <div className="bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
            <p className="text-primary-800 font-semibold mb-4">
              Solo los pacientes registrados pueden dejar una opinión.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/login" className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">Iniciar sesión</a>
              <a href="/registro" className="px-6 py-2 bg-white text-primary-600 border border-primary-200 rounded-xl font-bold hover:bg-primary-50 transition-colors">Crear cuenta</a>
            </div>
          </div>
        )}

        {/* Lista de Opiniones */}
        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-100"></div>
            ))
          ) : reviews.length === 0 ? (
            <p className="col-span-2 text-center text-slate-500 py-12">Aún no hay opiniones. ¡Sé el primero en compartir tu experiencia!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl text-primary-600 font-serif">"</span>
                </div>
                <div className="flex flex-col h-full space-y-4">
                  <div className="text-amber-400 text-sm tracking-widest">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed flex-grow italic">
                    "{review.comment}"
                  </p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <p className="font-bold text-slate-900">{review.user?.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
