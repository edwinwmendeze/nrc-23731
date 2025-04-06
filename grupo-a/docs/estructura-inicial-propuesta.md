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
│   │   ├── portfolio/
│   │   │   ├── ProfileHeader.astro
│   │   │   ├── ProjectsSection.astro
│   │   └── admin/
│   │       ├── Dashboard.astro
│   │       └── ProjectManager.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   └── portfolio/
│   │       └── [username].astro
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── data/
│       ├── profiles/
│       │   └── [username].json
│       └── config/
│           ├── site.json
├── public/
│   ├── images/
│   │   ├── logos/
│   │   ├── avatars/
│   │   └── projects/
│   └── assets/
│       ├── fonts/
│       └── icons/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## 2. Estructura de Datos

### 2.1 JSON Resume Schema ([username].json)

```json
{
    "basics": {
        "name": "",
        "label": "",
        "image": "",
        "email": "",
        "phone": "",
        "url": "",
        "summary": "",
        "location": {
            "address": "",
            "postalCode": "",
            "city": "",
            "countryCode": "",
            "region": ""
        },
        "profiles": [
            {
                "network": "",
                "username": "",
                "url": ""
            }
        ]
    },
    "work": [
        {
            "name": "",
            "position": "",
            "url": "",
            "startDate": "",
            "endDate": "",
            "summary": "",
            "highlights": []
        }
    ],
    "education": [],
    "skills": [
        {
            "name": "",
            "keywords": [],
            "level": ""
        }
    ],
    "projects": [
        {
            "name": "",
            "description": "",
            "highlights": [],
            "keywords": [],
            "startDate": "",
            "endDate": "",
            "url": "",
            "roles": [],
            "entity": "",
            "type": ""
        }
    ],
    "meta": {
        "version": "v1.0.0",
        "lastModified": "",
        "visibility": "public",
        "customFields": {
            "role": "",
            "specialties": [],
            "availability": ""
        }
    }
}
```

### 2.2 Configuración del Sitio (site.json)

```json
{
    "site": {
        "name": "Portafolio Grupal",
        "description": "Portafolio colaborativo del equipo",
        "url": "https://portfolio-grupo.com",
        "logo": "/images/logo.png",
        "social": {
            "github": "https://github.com/portfolio-grupo",
            "linkedin": "https://linkedin.com/company/portfolio-grupo"
        },
        "contact": {
            "email": "contact@portfolio-grupo.com"
        },
        "seo": {
            "title": "Portafolio Grupal - Equipo de Desarrollo",
            "description": "Portafolio colaborativo que muestra nuestros proyectos y habilidades",
            "keywords": ["desarrollo", "web", "portfolio", "equipo"]
        }
    },
    "team": {
        "name": "Grupo A",
        "description": "Equipo de desarrollo especializado",
        "members": [
            {
                "username": "member1",
                "role": "Frontend Developer",
                "specialties": ["React", "Vue", "TypeScript"],
                "joinDate": "2024-01-01"
            }
        ],
        "stats": {
            "totalMembers": 0,
            "totalProjects": 0,
            "totalSkills": 0
        }
    }
}
```

### 2.3 Configuración de Temas (theme.json)

```json
{
    "themes": {
        "light": {
            "colors": {
                "primary": "#007AFF",
                "secondary": "#5856D6",
                "background": "#FFFFFF",
                "surface": "#F2F2F7",
                "text": {
                    "primary": "#000000",
                    "secondary": "#666666"
                },
                "border": "#E5E5EA"
            },
            "typography": {
                "fontFamily": {
                    "primary": "Inter, sans-serif",
                    "secondary": "Roboto, sans-serif"
                }
            }
        },
        "dark": {
            "colors": {
                "primary": "#0A84FF",
                "secondary": "#5E5CE6",
                "background": "#000000",
                "surface": "#1C1C1E",
                "text": {
                    "primary": "#FFFFFF",
                    "secondary": "#EBEBF5"
                },
                "border": "#38383A"
            }
        }
    }
}
```

## 3. Dependencias Principales

### 3.1 Frontend

-   astro: ^4.0.0
-   react: ^18.2.0
-   typescript: ^5.0.0
-   tailwindcss: ^3.3.0
-   @astrojs/react: ^3.0.0
-   @astrojs/tailwind: ^5.0.0

### 3.2 Desarrollo

-   eslint: ^8.0.0
-   prettier: ^3.0.0
-   jest: ^29.0.0
-   typescript-eslint: ^6.0.0

### 3.3 Herramientas

-   date-fns: ^2.30.0
-   i18next: ^23.0.0
-   react-i18next: ^13.0.0
-   framer-motion: ^10.0.0

## 4. Scripts y Comandos

### 4.1 Desarrollo

```json
{
    "scripts": {
        "dev": "astro dev",
        "start": "astro dev",
        "build": "astro build",
        "preview": "astro preview"
    }
}
```

### 4.2 Testing

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch"
    }
}
```

### 4.3 Linting y Formateo

```json
{
    "scripts": {
        "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
        "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
        "format": "prettier --write ."
    }
}
```

## 5. Configuraciones

### 5.1 Astro (astro.config.mjs)

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
    integrations: [react(), tailwind()],
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
        "jsx": "react-jsx",
        "strict": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src"]
}
```

### 5.3 ESLint (.eslintrc.js)

```javascript
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:astro/recommended",
        "plugin:react/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
};
```

### 5.4 Prettier (.prettierrc)

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100
}
```

## 6. Documentación

### 6.1 README.md

````markdown
# Portafolio Grupal

Portafolio colaborativo desarrollado con Astro y React.

## Características

-   Portafolios individuales
-   Proyectos grupales
-   Panel de administración
-   Internacionalización (ES/EN)
-   Tema claro/oscuro
-   Accesibilidad
-   SEO optimizado

## Requisitos

-   Node.js 18+
-   npm 9+

## Instalación

1. Clonar el repositorio
2. Instalar dependencias
3. Configurar variables de entorno
4. Iniciar servidor de desarrollo

## Desarrollo

```bash
npm run dev
```
````

## Construcción

```bash
npm run build
```

## Licencia

MIT

```

```
