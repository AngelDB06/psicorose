import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          "nav": {
            "home": "Inicio",
            "about": "Sobre Rosa",
            "reviews": "Opiniones",
            "blog": "Blog",
            "profile": "Perfil",
            "logout": "Cerrar sesión",
            "login": "Iniciar Sesión",
            "register": "Registrarse"
          },
          "home": {
            "hero_tag": "Orientación Psicológica Profesional",
            "hero_title_1": "Un espacio seguro para tu",
            "hero_title_2": "bienestar emocional",
            "hero_subtitle": "Da el primer paso hacia una vida más plena y consciente. En nuestra consulta encontrarás un enfoque centrado en ti, desde un entorno de máxima confianza y empatía.",
            "book_now": "Comenzar tu Terapia",
            "ai_assistant": "Asistente IA Inicial",
            "services": "Nuestros Servicios"
          },
          "dashboard": {
            "welcome": "¡Hola de nuevo!",
            "subtitle": "Este es tu refugio personal para tu crecimiento.",
            "next_appointment": "Tu Próxima Sesión",
            "my_profile": "Mi Perfil",
            "new_appointment": "Nueva Cita",
            "download_report": "Descargar Historial (PDF)"
          }
        }
      },
      en: {
        translation: {
          "nav": {
            "home": "Home",
            "about": "About Rosa",
            "reviews": "Reviews",
            "blog": "Blog",
            "profile": "Profile",
            "logout": "Logout",
            "login": "Login",
            "register": "Register"
          },
          "home": {
            "hero_tag": "Professional Psychological Orientation",
            "hero_title_1": "A safe space for your",
            "hero_title_2": "emotional well-being",
            "hero_subtitle": "Take the first step towards a fuller and more conscious life. In our practice you will find a person-centered approach, within an environment of maximum trust and empathy.",
            "book_now": "Start your Therapy",
            "ai_assistant": "Initial AI Assistant",
            "services": "Our Services"
          },
          "dashboard": {
            "welcome": "Hello again!",
            "subtitle": "This is your personal sanctuary for your growth.",
            "next_appointment": "Your Next Session",
            "my_profile": "My Profile",
            "new_appointment": "New Appointment",
            "download_report": "Download History (PDF)"
          }
        }
      }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
