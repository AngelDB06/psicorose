# 🛠️ Tecnologías Empleadas - PsicoRose

Este documento detalla el stack tecnológico utilizado en el desarrollo, automatización y despliegue de la plataforma PsicoRose, justificando la elección de cada herramienta basándose en su rendimiento, escalabilidad y mantenibilidad.

---

## 1. Frontend (Capa de Presentación)
Se ha optado por una arquitectura de **Single Page Application (SPA)** para garantizar una experiencia de usuario fluida y sin recargas de página.

- **React.js**: Biblioteca principal para la construcción de interfaces basadas en componentes reactivos.
- **Tailwind CSS**: Framework de CSS utilitario para un diseño rápido, consistente y altamente personalizable.
- **Vite**: Herramienta de construcción (build tool) de última generación que ofrece una velocidad de desarrollo y compilación superior a las alternativas tradicionales.
- **Axios**: Cliente HTTP para la comunicación eficiente con la API del backend.
- **React Router Dom**: Gestión de la navegación y protección de rutas según el rol del usuario (Paciente/Admin).
- **i18next**: Sistema de internacionalización para dar soporte multi-idioma (Español/Inglés).

## 2. Backend (Capa de Lógica y Datos)
Construido bajo una arquitectura **RESTful** utilizando el entorno de ejecución Node.js.

- **Node.js & Express**: Entorno de ejecución y framework minimalista para la creación de una API escalable y robusta.
- **MongoDB Atlas**: Base de datos NoSQL en la nube, elegida por su flexibilidad en el modelado de documentos.
- **Mongoose**: ODM (Object Data Modeling) para gestionar la validación y las relaciones de los datos de MongoDB.
- **JSON Web Token (JWT)**: Estándar para la autenticación segura y el intercambio de información entre cliente y servidor.
- **Bcryptjs**: Algoritmo de hashing para el almacenamiento seguro de contraseñas.
- **Nodemailer**: Motor de envío de correos electrónicos transaccionales.
- **PDFKit**: Generación dinámica de informes clínicos en formato PDF.

## 3. Automatización e Inteligencia Artificial
- **n8n**: Orquestador de flujos de trabajo (workflows) utilizado para la automatización de recordatorios de citas mediante Webhooks.
- **Google Gemini (AI)**: Modelo de lenguaje de gran escala (LLM) utilizado para potenciar el ChatBot de soporte emocional y orientativo.

## 4. Infraestructura y DevOps
Se ha seguido una metodología de **Infraestructura como Código (IaC)** y despliegue profesional.

- **Docker**: Contenedorización de aplicaciones para garantizar la portabilidad entre entornos.
- **Kubernetes (k3s)**: Orquestador de contenedores para la gestión de la alta disponibilidad, escalabilidad y despliegue en clúster.
- **GitHub Actions**: Herramienta de CI/CD para la automatización de pruebas y despliegue automático en el servidor (AWS EC2).
- **Morgan**: Middleware de registro (logging) para la auditoría de accesos y errores del servidor.

## 5. Calidad y Pruebas
- **Mocha & Chai**: Framework y biblioteca de aserciones para la ejecución de pruebas unitarias.
- **Supertest**: Biblioteca para realizar pruebas de integración de los endpoints de la API.
