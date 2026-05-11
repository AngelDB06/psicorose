import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function FloatingChat() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Inicializar el mensaje de bienvenida desde i18n
  useEffect(() => {
    setMessages([{ role: 'assistant', text: t('chat.welcome') }]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');

    // Formatear el historial (debe empezar con 'user')
    const chatHistory = messages
      .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatHistory }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: t('chat.error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-primary-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                🌹
              </div>
              <div>
                <h3 className="font-bold text-sm">PsicoRose AI</h3>
                <p className="text-[10px] text-primary-100">{t('chat.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label={t('chat.close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
              aria-label={t('chat.send')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>

          <div className="px-4 py-2 bg-slate-50 text-[9px] text-center text-slate-400 uppercase tracking-widest border-t border-slate-100">
            {t('chat.disclaimer')}
          </div>
        </div>
      )}

      {/* Botón de apertura */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-primary-500 text-white'
        }`}
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          '🌹'
        )}
      </button>
    </div>
  );
}

export default FloatingChat;
