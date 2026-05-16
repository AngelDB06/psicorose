#  Anteproyecto: Plataforma PsicoRose

**Autor**: Ángel Domínguez Barranco  
**Título**: PsicoRose - Ecosistema Digital para la Gestión Clínica y Soporte al Paciente  

---

## 1. Introducción y Contexto
En el ámbito de la psicología sanitaria, la gestión administrativa suele ser un obstáculo para la práctica terapéutica. La falta de herramientas centralizadas obliga a los profesionales a gestionar citas, recordatorios y seguimientos de forma manual, lo que conlleva pérdida de tiempo y posibles errores humanos. PsicoRose nace como una respuesta tecnológica a esta necesidad real.

## 2. Planteamiento del Problema
Los centros de psicología independientes se enfrentan a tres retos principales:
1.  **Alta tasa de inasistencia (No-Show)**: Pacientes que olvidan sus citas debido a la falta de recordatorios automáticos.
2.  **Fragmentación de la información**: Datos de pacientes, historiales y citas dispersos en diferentes soportes.
3.  **Baja accesibilidad inmediata**: Dificultad para ofrecer soporte o información básica fuera del horario de consulta.

## 3. Objetivos del Proyecto

### 3.1 Objetivo General
Desarrollar una plataforma integral (Fullstack) que automatice la gestión administrativa de una consulta de psicología y mejore la interacción con el paciente mediante el uso de Inteligencia Artificial y orquestadores de flujos de trabajo.

### 3.2 Objetivos Específicos
- **Automatización**: Implementar un sistema de recordatorios automáticos vía email 24h antes de cada cita mediante n8n.
- **Interacción Inteligente**: Desplegar un Chatbot basado en IA (Google Gemini) para soporte emocional y administrativo básico.
- **Gestión Clínica**: Crear un panel de administración robusto para la Dra. Rosa que permita el seguimiento detallado de cada paciente.
- **Seguridad y Disponibilidad**: Configurar una infraestructura profesional en la nube utilizando contenedores Docker y orquestación con Kubernetes.

## 4. Metodología y Desarrollo
Se ha seguido una metodología ágil de desarrollo iterativo:
- **Fase 1: Diseño de Datos**: Modelado en MongoDB para garantizar flexibilidad.
- **Fase 2: Backend y API**: Creación del núcleo lógico con Node.js y Express.
- **Fase 3: Frontend y UX**: Diseño de la interfaz con React enfocada en la facilidad de uso.
- **Fase 4: Integración y Automatización**: Conexión con n8n y modelos de IA generativa.
- **Fase 5: Despliegue y Pruebas**: Configuración de CI/CD y despliegue en clúster k3s.

## 5. Resultados Esperados
- Reducción del tiempo dedicado a tareas administrativas en un 70%.
- Mejora en la imagen de marca profesional de la consulta.
- Centralización total de la información clínica y de soporte.

## 6. Recursos Necesarios
- **Software**: MERN Stack, Docker, Kubernetes, n8n, Google Gemini API.
- **Hardware/Cloud**: Servidores AWS (EC2) para el despliegue del clúster.
- **Herramientas de Calidad**: Jest/Mocha para pruebas unitarias.
