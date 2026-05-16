# 🌹 PsicoRose - Plataforma Integral de Salud Mental

PsicoRose es una solución tecnológica avanzada diseñada para la gestión integral de consultas de psicología sanitaria. Este proyecto combina la potencia del **MERN Stack** con automatizaciones inteligentes y despliegue profesional en la nube, optimizando la interacción entre paciente y profesional.

---

## 🚀 Características Principales

### 🧘‍♂️ Para el Paciente
- **Reserva Inteligente**: Sistema de reserva de citas con disponibilidad en tiempo real.
- **Portal Personal**: Historial de citas, gestión de perfil y descarga de reportes en PDF.
- **Acompañamiento IA**: Chatbot de apoyo emocional 24/7 integrado con **Google Gemini**.
- **Recordatorios Automáticos**: Notificaciones por email 24 horas antes de la cita mediante flujos de **n8n**.

### 👩‍⚕️ Para el Administrador (Rosa)
- **Agenda Dinámica**: Dashboard optimizado para visualizar solo las citas próximas.
- **Historial Clínico Completo**: Buscador y filtros avanzados por paciente.
- **Gestión de Contenidos**: Panel administrativo para la publicación de artículos en el Blog.
- **Auditoría y Exportación**: Generación de informes CSV para análisis de datos y seguimiento clínico.

---

## 🛠️ Stack Tecnológico

| Área | Tecnologías |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Vite, i18next (Multi-idioma) |
| **Backend** | Node.js, Express, Mongoose, PDFKit, Nodemailer |
| **Base de Datos** | MongoDB Atlas (Cloud) |
| **IA & Automatización** | Google Gemini AI, n8n Workflow Engine |
| **Infraestructura** | Docker, Kubernetes (k3s), GitHub Actions (CI/CD) |

---

## 📂 Estructura del Proyecto

```text
📁 psicorose/
├── 📁 frontend/          # Aplicación React (Vite)
├── 📁 backend/           # API REST (Node.js/Express)
├── 📁 infrastructure/    # Manifiestos de Kubernetes y Dockerfiles
├── 📁 .github/workflows  # Pipelines de Integración y Despliegue Continuo
└── 📁 docs/              # Documentación técnica y guías de estilo
```

---

## 🔧 Instalación y Desarrollo Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/psicorose.git
cd psicorose
```

### 2. Configurar el Backend
```bash
cd backend
npm install
# Crea un archivo .env basado en la documentación y añade tus credenciales
npm run dev
```

### 3. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🚢 Despliegue y DevOps

El proyecto está diseñado para ser desplegado de forma profesional mediante contenedores:

- **CI/CD**: GitHub Actions automatiza la ejecución de tests y la construcción de imágenes.
- **Docker**: Imágenes optimizadas para Frontend y Backend alojadas en GitHub Container Registry (GHCR).
- **Kubernetes**: Orquestación de servicios en un clúster k3s, garantizando alta disponibilidad y escalabilidad.

---

## ✒️ Autor

*   **Ángel Domínguez Barranco** - *Desarrollo y Diseño* - (https://github.com/tu-usuario)

---

## 📄 Licencia

Este proyecto ha sido desarrollado como Trabajo de Fin de Grado (TFG). Todos los derechos reservados.