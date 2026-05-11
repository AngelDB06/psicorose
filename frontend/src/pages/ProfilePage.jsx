import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar]   = useState(null);
  const [preview, setPreview] = useState(user?.avatar ? `${user.avatar}` : null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('psicorose_token');
      const data  = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (avatar) data.append('avatar', avatar);

      const response = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        updateUser(result);
        setMessage({ type: 'success', text: t('profile.success') });
      } else {
        setMessage({ type: 'error', text: result.message || t('profile.error') });
      }
    } catch {
      setMessage({ type: 'error', text: t('common.error_connection') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

          {/* Cabecera del Perfil */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-12 text-center text-white">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 backdrop-blur-md mb-4 mx-auto shadow-2xl relative">
                {preview ? (
                  <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-4 right-0 bg-white text-primary-600 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                title={t('profile.change_photo')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-primary-100 mt-1">
              {user?.role === 'admin' ? t('profile.role_admin') : t('profile.role_patient')}
            </p>
          </div>

          {/* Formulario de Edición */}
          <div className="p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('profile.name_label')}</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('register.phone_label')}</label>
                  <input
                    type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 transition-all"
                    required
                  />
                </div>
              </div>

              {message.text && (
                <div className={`p-4 rounded-2xl text-center font-semibold text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
                <button
                  type="submit" disabled={loading}
                  className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-100 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {loading ? t('profile.saving') : t('profile.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
