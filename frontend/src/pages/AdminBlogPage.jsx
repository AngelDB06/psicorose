import React, { useState, useEffect } from 'react';

function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para el formulario
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    readTime: 5,
    excerpt: '',
    content: '',
    published: true,
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch('http://localhost:5000/api/posts/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al cargar los artículos');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateForm = () => {
    setCurrentPost(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      title: '',
      category: '',
      image: '',
      readTime: 5,
      excerpt: '',
      content: '',
      published: true,
    });
    setIsEditing(true);
  };

  const openEditForm = (post) => {
    setCurrentPost(post);
    setImageFile(null);
    setImagePreview(post.image ? `http://localhost:5000${post.image}` : '');
    setFormData({
      title: post.title,
      category: post.category,
      image: post.image,
      readTime: post.readTime,
      excerpt: post.excerpt,
      content: post.content.join('\n\n'),
      published: post.published,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('psicorose_token');
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('readTime', formData.readTime);
      data.append('excerpt', formData.excerpt);
      data.append('published', formData.published);
      
      // Contenido como JSON string para que el backend lo parsee si es necesario, 
      // o simplemente enviar los párrafos uno a uno si el backend lo espera así.
      // Pero el backend espera un array en req.body.content.
      // Multer no parsea arrays automáticamente en FormData.
      // Así que enviamos el texto plano y dejamos que el backend lo divida (ya lo hace en createPost)
      data.append('content', formData.content);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image) {
        data.append('image', formData.image);
      }

      const url = currentPost 
        ? `http://localhost:5000/api/posts/${currentPost._id}`
        : 'http://localhost:5000/api/posts';
        
      const method = currentPost ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el artículo');
      }

      await fetchPosts();
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este artículo de forma permanente?')) return;
    
    try {
      const token = localStorage.getItem('psicorose_token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al borrar el artículo');
      await fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">
              {currentPost ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h1>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-slate-500 hover:text-slate-700 font-semibold"
            >
              ← Volver al listado
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Título</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Ej: Cómo gestionar el estrés"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Categoría</label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Ej: Ansiedad"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Imagen del artículo</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 italic">También puedes pegar una URL si lo prefieres abajo (opcional)</p>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-1 mt-2 rounded-lg border border-slate-100 text-xs focus:outline-none"
                        placeholder="URL de imagen alternativa..."
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tiempo de lectura (minutos)</label>
                  <input
                    type="number"
                    name="readTime"
                    required
                    min="1"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Extracto (Resumen corto)</label>
                <textarea
                  name="excerpt"
                  required
                  rows="2"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Un breve resumen que aparecerá en la tarjeta del blog..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contenido (Párrafos separados por doble salto de línea)</label>
                <textarea
                  name="content"
                  required
                  rows="15"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Párrafo 1...&#10;&#10;Párrafo 2..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="published" className="font-semibold text-slate-700">
                  Publicar artículo inmediatamente (visible para el público)
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
                >
                  {currentPost ? 'Actualizar Artículo' : 'Crear Artículo'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gestión del Blog</h1>
            <p className="text-slate-500 mt-1">Crea y edita tus artículos publicados.</p>
          </div>
          <button
            onClick={openCreateForm}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-bold flex items-center gap-2"
          >
            <span>+</span> Nuevo Artículo
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-4">📝</span>
              <h3 className="text-xl font-bold text-slate-700">Aún no hay artículos</h3>
              <p className="text-slate-500 mt-2">Empieza a compartir tu conocimiento creando tu primer post.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Artículo</th>
                    <th className="pb-3 font-semibold">Categoría</th>
                    <th className="pb-3 font-semibold text-center">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-slate-800">{post.title}</p>
                        <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString('es-ES')}</p>
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-medium">
                        <span className="px-2 py-1 bg-slate-100 rounded-lg">{post.category}</span>
                      </td>
                      <td className="py-4 text-center">
                        {post.published ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200">
                            Publicado
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-slate-100 text-slate-600 border-slate-200">
                            Borrador
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditForm(post)}
                          className="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminBlogPage;
