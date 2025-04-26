# Documentación del Proyecto: Portafolio Grupal

## 1. Planteamiento del Problema

### 1.1 Contexto

En la era digital actual, la presencia en línea es fundamental para profesionales y estudiantes. Un portafolio digital efectivo puede ser la diferencia entre ser notado o pasar desapercibido en el mercado laboral. La necesidad de una plataforma que permita mostrar el trabajo colaborativo y las habilidades individuales se ha vuelto más relevante que nunca.

### 1.2 Problema

- Falta de presencia digital profesional unificada para el grupo
- Dificultad para mostrar tanto el trabajo en equipo como las habilidades individuales
- Necesidad de un punto central que conecte con los portafolios individuales
- Desafío de mantener una identidad grupal mientras se destaca el talento individual
- Dificultad para demostrar trabajo colaborativo y resultados del equipo
- Limitaciones en la accesibilidad de proyectos web tradicionales

### 1.3 Solución Propuesta

Desarrollo de un portafolio web grupal utilizando Astro como framework principal, que permite:

- Mostrar información del equipo como unidad
- Presentar a cada integrante con enlaces a sus portafolios individuales
- Mantener un diseño responsive y accesible (100/100 en Lighthouse)
- Implementar buenas prácticas de desarrollo
- Proporcionar una experiencia de usuario intuitiva
- Utilizar JSON para la gestión eficiente de los datos de perfiles

## 2. Objetivos

### 2.1 Objetivo General

Desarrollar un portafolio web grupal que sirva como hub central para presentar al equipo, sus integrantes y proyectos, con enlaces directos a los portafolios individuales de cada miembro, todo bajo estándares de calidad, accesibilidad y rendimiento.

### 2.2 Objetivos Específicos

1. Crear una interfaz visual moderna y accesible (puntuación 100/100 en accesibilidad)
2. Implementar un sistema de manejo de excepciones para mejorar la experiencia de usuario
3. Aplicar principios de código limpio y buenas prácticas
4. Crear una experiencia de usuario intuitiva con navegación clara
5. Utilizar un sistema de datos JSON para los perfiles de los integrantes
6. Implementar enlaces a portafolios individuales mediante botones CTA "Ver portafolio"
7. Asegurar compatibilidad con dispositivos móviles y diferentes navegadores
8. Optimizar el rendimiento y tiempos de carga

## 3. Funcionalidades Principales

### 3.1 Página Principal

- Banner principal con información del equipo
- Navegación intuitiva a diferentes secciones
- Diseño moderno y responsive
- Manejo de errores con componentes ErrorBoundary

### 3.2 Sección de Integrantes

- Presentación de cada miembro del equipo con:
  - Foto de perfil
  - Nombre y rol profesional
  - Descripción breve
  - Ubicación
  - Redes sociales profesionales
  - Botón CTA "Ver portafolio" que enlaza al portafolio individual
- Carga dinámica de perfiles desde archivos JSON
- Diseño adaptable a diferentes cantidades de integrantes

### 3.3 Sistema de Datos

- Arquitectura basada en archivos JSON para almacenar información de perfiles
- Estructura estandarizada para cada perfil incluyendo:
  - Información básica (nombre, rol, resumen)
  - Datos de contacto
  - URL del portafolio personal
  - Habilidades técnicas
  - Redes sociales

### 3.4 Accesibilidad

- Puntuación perfecta (100/100) en auditorías de Lighthouse
- Contraste adecuado para todos los textos
- Viewport configurado para permitir escalado de usuario
- Etiquetas semánticas HTML5
- Textos alternativos descriptivos para todas las imágenes
- Variables CSS consistentes para mantener coherencia visual

### 3.5 Características Avanzadas de UX

#### 3.5.1 Tema Oscuro/Claro

- Sistema de cambio de tema con toggle intuitivo
- Persistencia de preferencia mediante localStorage
- Detección automática de preferencias del sistema operativo
- Transiciones suaves entre temas para mejorar la experiencia visual
- Variables CSS optimizadas para mantener coherencia visual en ambos temas

#### 3.5.2 Botón "Volver Arriba"

- Aparición automática al hacer scroll
- Animación suave al subir
- Diseño adaptativo que se ajusta a modo oscuro/claro
- Optimizado para dispositivos móviles
- Mejora la navegación en páginas con mucho contenido

## 4. Tecnologías Utilizadas

### 4.1 Frontend

- **Astro**: Framework principal para la construcción del sitio
- **CSS Nativo**: Sistema de estilos con variables personalizadas
- **HTML Semántico**: Estructura optimizada para accesibilidad y SEO
- **JavaScript**: Funcionalidades interactivas y manejo de datos

### 4.2 Sistema de Manejo de Excepciones

- Componentes ErrorBoundary para capturar errores en tiempo de ejecución
- Fallbacks para recursos que puedan fallar (imágenes, datos)
- Manejo de errores de carga de datos y componentes

## 5. Estructura del Proyecto

### 5.1 Organización de Carpetas

```
portfolio-grupo/
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── TeamSection.astro
│   │   │   └── FeaturedProjects.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── SocialLink.astro
│   │       ├── ErrorBoundary.astro
│   │       ├── ErrorFallback.astro
│   │       └── ErrorMessage.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── base.css
│   ├── data/
│   │   ├── config/
│   │   └── profiles/
│   │       ├── EdwinMendez.json
│   │       └── [OtrosPerfiles].json
│   ├── services/
│   │   └── profileService.ts
│   ├── types/
│   │   ├── AppError.ts
│   │   ├── index.ts
│   │   ├── profile.ts
│   │   └── project.ts
│   └── utils/
│       └── errorUtils.ts
├── public/
│   ├── favicon.svg
│   └── images/
│       └── team/
│           └── edwin.png
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── jsconfig.json
├── .prettierrc
├── .eslintrc.cjs
└── README.md
```

### 5.2 Componentes Principales

- **TeamSection.astro**: Muestra los perfiles de los integrantes con enlaces a sus portafolios individuales
- **Button.astro**: Componente reutilizable para botones, incluyendo el CTA "Ver portafolio"
- **MainLayout.astro**: Plantilla principal que incluye la estructura común a todas las páginas
- **ErrorBoundary.jsx**: Componente para manejo de excepciones

## 6. Implementación de Perfiles

### 6.1 Estructura de Datos JSON

```json
{
  "basics": {
    "name": "Nombre",
    "last_name": "Apellido",
    "label": "Rol profesional",
    "image": {
      "local": "/ruta/a/imagen.jpg",
      "remote": "https://url-externa.com/imagen.jpg"
    },
    "email": "correo@ejemplo.com",
    "phone": "(51) 123-456-789",
    "url": "https://miportafolio-personal.com",
    "summary": "Breve descripción profesional",
    "location": {
      "city": "Ciudad",
      "countryCode": "PE",
      "region": "Región"
    },
    "profiles": [
      {
        "network": "GitHub",
        "username": "usuario",
        "url": "https://github.com/usuario"
      },
      {
        "network": "LinkedIn",
        "username": "usuario",
        "url": "https://linkedin.com/in/usuario"
      }
    ]
  },
  "skills": [
    {
      "name": "Categoría",
      "keywords": ["Habilidad1", "Habilidad2"],
      "type": "hard"
    }
  ]
}
```

### 6.2 Flujo de Funcionamiento

1. Los perfiles se almacenan como archivos JSON en `/src/data/profiles/`
2. El componente TeamSection carga dinámicamente todos los perfiles disponibles
3. Se renderiza una tarjeta para cada perfil con su información
4. El botón "Ver portafolio" utiliza la URL especificada en `basics.url`
5. Al hacer clic en el botón, se navega al portafolio individual del integrante

## 7. Accesibilidad y Rendimiento

### 7.1 Mejoras de Accesibilidad

- Implementación de viewport que permite escalado del usuario (`user-scalable=yes`)
- Contraste mejorado para textos y elementos interactivos
- Estructura semántica con encabezados organizados jerárquicamente
- Textos alternativos descriptivos para todas las imágenes
- Variables CSS consistentes para mantener coherencia visual

### 7.2 Optimización de Rendimiento

- Generación estática con Astro para cargas rápidas
- CSS optimizado sin frameworks pesados
- Carga optimizada de imágenes
- Manejo adecuado de fallbacks para recursos

## 8. Despliegue

### 8.1 GitHub Pages

- URL base: https://edwinwmendeze.github.io/
- Estructura de carpetas: el repositorio nrc-23731 contiene una carpeta grupo-a con el proyecto Astro
- Configuración de rutas base en Astro para compatibilidad con GitHub Pages

### 8.2 CI/CD

- Integración con GitHub Actions para despliegue automático
- Verificación de compilación en cada push a la rama principal
- Validación básica de código

## 9. Conclusiones y Resultados

### 9.1 Logros

- Portafolio grupal funcional que conecta con portafolios individuales
- Puntuación perfecta (100/100) en accesibilidad según Lighthouse
- Excelentes puntuaciones en SEO (100/100) y mejores prácticas (100/100)
- Sistema de perfiles dinámico y fácil de mantener
- Experiencia de usuario intuitiva y responsive

### 9.2 Futuras Mejoras

- Implementación de temas claro/oscuro
- Filtrado y búsqueda de integrantes
- Ampliación de la sección de proyectos con filtrado por categorías
- Integración con APIs de redes sociales para actualización automática de perfiles
