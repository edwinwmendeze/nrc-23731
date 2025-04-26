# Estructura del Proyecto

## 1. Estructura de Carpetas

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

## 2. Estructura de Datos

### 2.1 Perfil JSON (implementado)

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

## 3. Dependencias Principales Utilizadas

### 3.1 Frontend

- astro: ^4.0.0
- typescript: ^5.0.0

### 3.2 Desarrollo

- eslint: ^8.0.0
- prettier: ^3.0.0

## 4. Scripts Implementados

### 4.1 Desarrollo

```json
{
    "scripts": {
        "dev": "astro dev",
        "build": "astro build",
        "preview": "astro preview"
    }
}
```

## 5. Configuraciones

### 5.1 Astro (astro.config.mjs)

```javascript
import { defineConfig } from "astro/config";

export default defineConfig({
    site: 'https://edwinwmendeze.github.io',
    base: '/nrc-23731',
    output: "static",
});
```

### 5.2 TypeScript (tsconfig.json)

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "strict": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src"]
}
```

## 6. Documentación

### 6.1 README.md

````markdown
# Portafolio Grupal

Portafolio colaborativo desarrollado con Astro que muestra información del equipo y enlaza a los portafolios individuales de cada miembro.

## Características

- Presentación del equipo como unidad
- Enlaces a portafolios individuales mediante botones "Ver portafolio"
- Accesibilidad perfecta (100/100 en Lighthouse)
- Diseño responsive
- Estructura semántica HTML5

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

1. Clonar el repositorio
2. Instalar dependencias con `npm install`
3. Iniciar servidor de desarrollo con `npm run dev`

## Despliegue

El proyecto está desplegado en GitHub Pages:
https://edwinwmendeze.github.io/

## Desarrollo

```bash
npm run dev
```
````

## Construcción

```bash
npm run build
