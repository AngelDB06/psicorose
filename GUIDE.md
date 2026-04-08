# Guía y Especificación del Proyecto: PsicoRosa

## 🧠 1. Idea del Proyecto (Objetivo)
**Nombre del proyecto**: PsicoRosa – Plataforma web de gestión psicológica

**Objetivo**:
Desarrollar una aplicación web completa para la psicóloga Rosa María Barranco Torres que permita:
- Gestionar citas (reservas online automática).
- Publicar contenido estructurado (blog).
- Interactuar con clientes/usuarios.
- Integrar inteligencia artificial para apoyo emocional inicial.
- Automatizar procesos administrativos repetitivos.

**Valor añadido (Claves para obtener Sobresaliente)**:
- Chatbot con IA para orientación psicológica básica de la mano del usuario.
- Sistema de recordatorios automáticos de citas.
- Panel profesional administrativo para uso exclusivo de Rosa.
- PWA (Progressive Web App) instalable como app nativa en móviles.
- Sistema de evaluación del estado emocional diario (Tracker emocional).

## 🏗️ 2. Arquitectura y Stack Tecnológico
**Frontend**:
- **Tecnologías**: React (SPA), TailwindCSS y React Router.
- **Justificación**: Alto rendimiento, escalabilidad, maquetación ágil, componentes reutilizables y ajuste al estándar del mercado actual.

**Backend (Entorno Servidor)**:
- **Tecnologías**: Node.js + Express.
- **Justificación**: Rendimiento de E/S eficiente, ideal para APIs REST y arquitectura json-first.

**Base de Datos**:
- **Tecnología**: MongoDB (NoSQL) y Mongoose.
- **Justificación**: Flexibilidad para manejar usuarios y posts sin esquemas restrictivos, integración natural en Node.

**Inteligencia Artificial y Automatización**:
- **IA**: API de OpenAI / Claude (o modelos libres tipo Ollama) para el Chat orientativo (Triage no médico).
- **Automatización**: n8n conectado a base de datos o Webhooks. *Ejemplo: Reservas en BD -> n8n detecta -> Mail automático de confirmación o recordatorio.*

**DevOps y Despliegue**:
- Docker y Kubernetes (Orquestación).
- GitHub Actions (CI/CD Automático de tests y deploy).
- Hosting cloud (Ej. AWS, Vercel o Railway).

## 🧩 3. Funcionalidades Principales y Requisitos
1. **Sistema de usuarios**: Registro/Login seguro. Validación por email. Roles diferenciados: `User` (Cliente) y `Admin` (Rosa).
2. **Sistema de reservas**: Calendario interactivo de fechas y horas, manejado íntegramente de cara a la lógica en el Backend con aprobaciones, confirmaciones y anulaciones.
3. **Blog**: CRUD de entradas creado en el Panel Admin de Rosa. Visibilidad pública en la web.
4. **Chat con IA**: Bot con la primera pregunta *"¿Cómo te sientes hoy?"* y respuestas pre programadas orientativas (Disclaimer: NO equivale a terapia).
5. **Gestión de archivos**: Endpoint de Multer/GCP para subida y descarga de adjuntos, historiales o imágenes.
6. **Informes PDF**: Generador de PDF en Node.js de históricos de citas.
7. **Importar/Exportar**: Rutas para descargar/subir listados en JSON/CSV.
8. **Logging**: Ficheros de logs guardando el tráfico web, errores de backend, etc.

## 🎨 4. Diseño de Interfaces (UI/UX)
- **Maquetación CSS**: Se aplicará Flexbox, CSS Grid Layout y convenciones BEM si no se utliza utility-first o para estructurar los css globales.
- **Look & Feel**: Diseño homogéneo con paleta de colores suaves y relajantes (temática psicología) y tipografías legibles y espaciadas. Mobile First y Diseño 100% Responsivo.
- **Interfaz Interactiva**: Transiciones, Hover-effects en cartas/botones de Tailwind. Elementos de UI bien detallados.
- **Prototipo**: Recomendado hacer figma previo para pantallas Home, Citas, Dashboards.

## 💼 5. Empresa (Módulo IPE)
- **Oportunidad de negocio**: Transformación y digitalización de consultas psicológicas facilitando la burocracia del terapeuta.
- **Recursos e INversión**: A costear Dominios, Hosting, consumos de IA externa. Modelo autónomo o sociedad (A justificar fiscalidad e IRPF).
- **Rol**: 1 Dev y Rosa (Owner).

## 🌍 6. Otros Requisitos Fundamentales
- **Inglés / Internacionalización**: `i18next` en una sección relevante y el sobre-nosotros para certificar Inglés Técnico.
- **Seguridad e Infraestructura**: Dominio real (`psicorosa.com`), certificado HTTPS, almacenamiento de tokens JWT.
- **Testing y Código**: Documentación SWAGGER del backend API, Testing unitario con GitHub actions pasadas obligatoriamente. 

## 🗺️ 7. Mapa de Navegación General
1. **Home / Presentación**: Propósito y llamadas a la acción (Cita).
2. **Sobre Rosa**: Currículum y trayectoria.
3. **Blog**: Artículos públicos.
4. **Contacto**: Dudas rápidas / Bot IA.
5. **Portal Reservas**: Citas, horarios y pagos/validación.
6. **Login / Register**: Autenticación de pacientes.
7. **Dashboard Admin**: Exclusivo para gestión clínica.
