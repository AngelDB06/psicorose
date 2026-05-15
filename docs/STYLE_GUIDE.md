# 🎨 Guía de Estilos Visuales - PsicoRose

Esta guía define la identidad visual de la plataforma **PsicoRose**, garantizando una experiencia de usuario coherente, profesional y enfocada en el bienestar emocional.

## 1. Paleta de Colores

Se ha seleccionado una paleta basada en tonos **Índigo** y **Violeta**, que transmiten tranquilidad, confianza y profesionalidad médica, combinados con una escala de **Grises (Slate)** para la legibilidad.

| Color | Hexadecimal | Uso Principal |
| :--- | :--- | :--- |
| **Primario (Indigo 600)** | `#4f46e5` | Botones principales, enlaces, acentos. |
| **Primario Claro (Indigo 50)** | `#eef2ff` | Fondos de tarjetas, hover en menús. |
| **Acento (Violet 600)** | `#7c3aed` | Elementos de IA (ChatBot), notificaciones. |
| **Fondo (Slate 50)** | `#f8fafc` | Fondo general de la aplicación. |
| **Texto Principal (Slate 900)** | `#0f172a` | Títulos y cuerpo de texto importante. |
| **Texto Secundario (Slate 500)** | `#64748b` | Descripciones, placeholders y textos de apoyo. |

## 2. Tipografía

Se utiliza la familia de fuentes **Inter** por su alta legibilidad en pantallas digitales y su aspecto moderno y limpio.

*   **Títulos (H1, H2)**: `Inter`, SemiBold/ExtraBold (weight 600/800). Tracking ligero (-0.025em).
*   **Cuerpo de Texto**: `Inter`, Regular (weight 400). Line-height 1.6 para mejorar la lectura.
*   **Textos Técnicos/Métricas**: `Inter`, Medium (weight 500).

## 3. Componentes de Interfaz

### Botones (Buttons)
*   **Primary**: Fondo sólido `Indigo 600`, texto blanco, bordes redondeados (`2xl`), sombra suave.
*   **Secondary**: Borde `Slate 200`, fondo blanco, texto `Slate 600`.
*   **Danger**: Fondo `Red 50`, texto `Red 600`, usado para cancelaciones o cierre de sesión.

### Tarjetas (Cards)
*   **Estilo**: Fondo blanco, bordes redondeados extra grandes (`3xl`), sombra muy sutil (`shadow-sm`).
*   **Hover**: Elevación ligera (`shadow-md`) y traslación en el eje Y (`-2px`).

### Formularios (Inputs)
*   Bordes redondeados `xl`.
*   Fondo `Slate 50`.
*   Focus state con anillo de `Indigo 500` (ring-2).

## 4. Principios de Diseño
1.  **Espaciado Generoso**: Uso de márgenes amplios para evitar la fatiga visual.
2.  **Esquinas Suaves**: Uso extensivo de `border-radius: 24px` o superior para transmitir cercanía y amabilidad.
3.  **Micro-interacciones**: Transiciones suaves (`transition-all duration-300`) en todos los elementos interactivos.
