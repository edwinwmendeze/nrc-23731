# Informe Técnico: Portafolio Grupal - Grupo A

## 1. Resumen

Se ha desarrollado un portafolio web grupal utilizando Astro como framework principal, con el objetivo de mostrar la información profesional del equipo y sus proyectos destacados. El portafolio cuenta con un diseño responsive, moderno y accesible, implementando las mejores prácticas de desarrollo web y técnicas avanzadas de manejo de errores y optimización de rendimiento.

## 2. Tecnologías Utilizadas

- **Astro**: Framework principal para construcción de sitios web estáticos con enfoque en rendimiento
- **TypeScript**: Tipado estático para mejorar la calidad del código y detectar errores tempranamente
- **CSS Nativo**: Sistema de estilos con variables CSS personalizadas para mantener consistencia visual
- **GitHub Pages**: Plataforma de despliegue para la aplicación web

### 2.1 ¿Por qué Elegimos Astro?

La elección de Astro como framework principal para este portafolio grupal se basó en varias consideraciones estratégicas:

1. **Rendimiento Optimizado**: Astro genera sitios estáticos por defecto, lo que resulta en páginas web extremadamente rápidas y eficientes, ideal para un portafolio que necesita causar una buena primera impresión.

2. **"Zero JavaScript por defecto"**: Astro solo envía JavaScript al cliente cuando es absolutamente necesario, lo que reduce significativamente el tamaño de carga y mejora la experiencia del usuario en dispositivos de gama baja o conexiones lentas.

3. **Facilidad de Integración**: Permite utilizar componentes de diferentes frameworks (React, Vue, Svelte) dentro del mismo proyecto, lo que facilita la contribución de miembros del equipo con diferentes habilidades.

4. **Compatibilidad con TypeScript**: El soporte nativo para TypeScript permite un desarrollo más seguro y productivo, reduciendo errores potenciales durante el desarrollo colaborativo.

5. **Despliegue Sencillo**: La generación estática facilita el despliegue en plataformas como GitHub Pages, eliminando la necesidad de servidores costosos o configuraciones complejas.

6. **Arquitectura de Islas**: Permite optimizar partes específicas de la aplicación de forma independiente, lo que resulta en un mejor rendimiento general y una experiencia de desarrollo más modular.

## 3. Arquitectura del Proyecto

### 3.1 Estructura de Carpetas

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
│   ├── lib/
│   │   └── orm/
│   │       ├── BaseORM.ts
│   │       └── ProfileORM.ts
│   ├── types/
│   │   ├── AppError.ts
│   │   ├── index.ts
│   │   ├── profile.ts
│   │   └── project.ts
│   └── utils/
│       └── errorUtils.ts
├── tests/
│   └── lib/
│       └── orm/
│           ├── BaseORM.test.ts
│           └── ProfileORM.test.ts
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
├── vitest.config.ts
└── README.md
```

### 3.2 Patrones Arquitectónicos

El proyecto implementa los siguientes patrones arquitectónicos propios del framework Astro ([Documentación oficial de Astro](https://docs.astro.build/es/concepts/patterns/)):

1. **Arquitectura de Componentes**: División clara en componentes reutilizables e independientes, siguiendo el modelo de componentes de Astro.
2. **SSG (Static Site Generation)**: Generación estática para optimizar rendimiento y SEO, una característica fundamental de Astro.
3. **Arquitectura por Capas**: Separación entre UI, datos y lógica de aplicación.
4. **Manejo de Errores Centralizado**: Sistema robusto para captura y presentación de errores.
5. **Object-Relational Mapping (ORM)**: Abstracción para manejo de archivos JSON como si fueran una base de datos relacional.

## 4. Componentes Principales

### 4.1 Estructura Base

#### 4.1.1 MainLayout

El componente `MainLayout.astro` proporciona la estructura base para todas las páginas, incluyendo:

- Metadatos SEO configurables (título, descripción)
- Encabezado con navegación
- Contenido principal con slot para inyección de contenido
- Pie de página con información del equipo
- Menú móvil para dispositivos pequeños
- Sistema de captura de errores a nivel de aplicación

Características destacadas:
- Implementación de `ErrorBoundary` para captura de errores de renderizado
- Navegación responsive con soporte para móviles

### 4.2 Página Principal

La página principal (`index.astro`) integra los siguientes componentes:

#### 4.2.1 Hero

Sección de presentación con:
- Título principal del equipo
- Descripción del sitio y del equipo
- Llamadas a la acción (CTA) para explorar el equipo
- Diseño adaptable a diferentes tamaños de pantalla

#### 4.2.2 TeamSection

Muestra información sobre los integrantes del equipo:
- Tarjetas de perfil con foto, nombre, rol y correo electrónico
- Enlaces a redes sociales/profesionales
- Habilidades destacadas
- Llamadas a la acción (CTA) para ver el portafolio individual
- Responsividad para diferentes dispositivos

#### 4.2.3 FeaturedProjects

Sección que exhibe los proyectos destacados del equipo:
- Tarjetas de proyecto con título, autor y descripción breve
- Etiquetas de tecnologías utilizadas
- Enlaces a demostraciones o repositorios
- Sin imágenes, enfocado en presentar la información textual de manera clara

### 4.3 Sistema de Manejo de Excepciones

#### 4.3.1 Tipos de Error (`AppError.ts`)

Define una estructura estandarizada para los errores de la aplicación:

```typescript
export type ErrorType = 
  | 'validation' 
  | 'network' 
  | 'authentication' 
  | 'authorization' 
  | 'server'
  | 'client'
  | 'not_found'
  | 'timeout';

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
  recoverable?: boolean;
}
```

#### 4.3.2 Servicios de Manejo de Errores

Se implementan los siguientes servicios:

- `ErrorHandlingService`: Procesa y categoriza errores uniformemente
- `logError`: Registra errores para diagnóstico
- `loadWithFallback`: Carga datos con reintentos y valores alternativos

#### 4.3.3 Componentes de UI para Errores

- `ErrorMessage.astro`: Muestra mensajes de error con estilos contextuales
- `ErrorBoundary.astro`: Captura errores de renderizado y muestra alternativas

## 5. Gestión de Datos

### 5.1 Estructura de Datos

Los datos del portafolio se gestionan principalmente a través de archivos JSON estructurados:

- `site.json`: Configuración general del sitio y del equipo
- Archivos de perfil para cada miembro del equipo (uno por integrante)
- Datos de proyectos destacados

### 5.2 Carga de Datos

Se implementan las siguientes estrategias:

- **Carga dinámica de perfiles**: El componente `TeamSection.astro` carga automáticamente los perfiles desde los archivos JSON en la carpeta `data/profiles/`. La cantidad de integrantes mostrados corresponde exactamente a la cantidad de archivos JSON en esta carpeta.
  
- **Carga dinámica de proyectos**: El componente `FeaturedProjects.astro` también se alimenta de los datos JSON, mostrando de forma dinámica los proyectos destacados.

- **Manejo robusto de errores**: Durante la carga de datos, se implementa un sistema que evita fallos en la aplicación si algún archivo no existe o tiene errores.

### 5.3 Implementación de ORM para JSON

Hemos implementado un sistema ORM (Object-Relational Mapping) para gestionar los archivos JSON como si fueran una base de datos relacional, siguiendo la metodología TDD (Test-Driven Development):

#### 5.3.1 Arquitectura del ORM

El sistema ORM consiste en dos clases principales:

1. **BaseORM**: Clase genérica que proporciona operaciones CRUD básicas para cualquier tipo de entidad:
   - Inicialización y gestión de directorios
   - Operaciones de lectura (findAll, findById)
   - Sistema de caché para optimizar lecturas repetidas
   - Manejo de errores

```typescript
// src/lib/orm/BaseORM.ts
import * as fs from 'fs/promises';
import path from 'path';

export class BaseORM<T extends { id: string }> {
  private basePath: string;
  private initialized: boolean = false;
  private cache: Map<string, T> = new Map();
  
  constructor(basePath: string) {
    this.basePath = basePath;
  }
  
  async initialize(): Promise<void> {
    try {
      await fs.access(this.basePath);
    } catch (error) {
      // Directorio no existe, lo creamos
      await fs.mkdir(this.basePath, { recursive: true });
    }
  }
  
  async findAll(options: { useCache?: boolean } = {}): Promise<T[]> {
    const { useCache = true } = options;
    
    try {
      // Inicializar si es necesario
      await this.initialize();
      
      // Leer todos los archivos JSON
      const files = await fs.readdir(this.basePath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Cargar y parsear cada archivo
      const entities: T[] = [];
      for (const file of jsonFiles) {
        const filePath = path.join(this.basePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        entities.push(JSON.parse(content));
      }
      
      return entities;
    } catch (error) {
      console.error('Error en findAll:', error);
      return [];
    }
  }
}
```

2. **ProfileORM**: Clase específica para perfiles que extiende BaseORM:
   - Validación específica para el modelo de perfil
   - Métodos adicionales como búsqueda por nombre o habilidades
   - Indexación para optimizar búsquedas frecuentes

```typescript
// src/lib/orm/ProfileORM.ts
import { BaseORM } from './BaseORM';
import path from 'path';
import type { Profile } from '../../types';

export class ProfileORM extends BaseORM<Profile> {
  constructor(basePath: string = path.join(process.cwd(), 'src/data/profiles')) {
    super(basePath);
  }
  
  async findByName(name: string): Promise<Profile[]> {
    const profiles = await this.findAll();
    return profiles.filter(profile => 
      profile.basics?.name === name
    );
  }
  
  // Otros métodos específicos para perfiles...
}
```

#### 5.3.2 Implementación siguiendo TDD

El desarrollo del ORM siguió estrictamente el ciclo TDD (Test-Driven Development):

1. **Fase RED**: Primero se escribieron pruebas para las funcionalidades deseadas, que inicialmente fallaban:

```typescript
// tests/lib/orm/BaseORM.test.ts
describe('initialize()', () => {
  it('debe crear el directorio si no existe', async () => {
    // Simular que el directorio no existe
    vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
    
    await orm.initialize();
    
    // Verificar que se intentó crear el directorio
    expect(fs.mkdir).toHaveBeenCalledWith(testDir, { recursive: true });
  });
});
```

2. **Fase GREEN**: Luego se implementó el código mínimo necesario para que las pruebas pasaran.

3. **Fase REFACTOR**: Finalmente, se mejoraron las implementaciones manteniendo las pruebas exitosas:
   - Adición de sistema de caché
   - Optimización de inicialización
   - Mejora en el manejo de errores

### 5.3.3 Optimización de consultas

Para garantizar un rendimiento óptimo, se implementaron varias técnicas de optimización:

1. **Sistema de caché en memoria**: Evita lecturas repetidas del sistema de archivos
2. **Inicialización perezosa**: Solo crea directorios cuando es necesario
3. **Indexación**: Para búsquedas frecuentes por nombre o habilidades
4. **Normalización de cadenas**: Para búsquedas insensibles a mayúsculas/minúsculas y acentos

### 5.3.4 Integración con el servicio existente

Se actualizó el `profileService.ts` para utilizar el nuevo ORM, manteniendo la compatibilidad con el resto de la aplicación:

```typescript
// src/services/profileService.ts
import { ProfileORM } from '../lib/orm/ProfileORM';
import type { Profile, ProjectWithAuthor } from '../types';

// Instancia del ORM
const profileORM = new ProfileORM();

export async function getProfiles(): Promise<Profile[]> {
  try {
    return await profileORM.findAll();
  } catch (error) {
    console.error('Error cargando perfiles:', error);
    return [];
  }
}

// Resto del servicio...
```

## 6. Optimizaciones y Rendimiento

### 6.1 Optimizaciones de Rendimiento

- **Generación estática con Astro**: Producción de HTML estático en tiempo de compilación, lo que elimina la necesidad de JavaScript en el cliente para la mayoría de las funcionalidades.
  
- **CSS optimizado con variables nativas**: Uso de variables CSS para mantener consistencia y facilitar el mantenimiento.
  
- **Minimización de recursos en producción**: Astro comprime y optimiza automáticamente todos los recursos (HTML, CSS, JS) en la compilación para producción.

### 6.2 SEO y Accesibilidad

- **Puntuaciones perfectas en Lighthouse**: La aplicación ha obtenido puntuaciones excelentes en las auditorías de Lighthouse:
  - Performance: 99/100
  - Accessibility: 100/100
  - Best Practices: 100/100
  - SEO: 100/100

- **Metadatos configurables**: Cada página tiene metadatos personalizados para SEO.
  
- **Semántica HTML5**: Uso de etiquetas semánticas para mejorar la accesibilidad y el SEO (`section`, `article`, `header`, etc.).
  
- **Textos alternativos**: Todas las imágenes incluyen atributos `alt` descriptivos.
  
- **Contraste adecuado**: Los colores del sitio han sido cuidadosamente seleccionados y ajustados para asegurar un contraste óptimo, mejorando la legibilidad para todos los usuarios, incluyendo aquellos con discapacidades visuales.

- **Escalabilidad mejorada**: Configuración de viewport optimizada para permitir el escalado del usuario (user-scalable=yes) con escalas mínima y máxima apropiadas.

- **Sistema de variables CSS**: Implementación de un sistema consistente de variables CSS para colores y estilos que mantiene la coherencia visual y facilita el cumplimiento de los estándares de accesibilidad WCAG.

## 6.3 Implementación de Funcionalidades Avanzadas

### 6.3.1 Sistema de Tema Oscuro/Claro

El portafolio implementa un sistema completo de temas claro/oscuro que mejora significativamente la experiencia de usuario:

1. ** Características técnicas**:
   - Uso de atributo `data-theme` en el elemento HTML raíz para controlar el tema
   - Variables CSS para todos los colores y elementos visuales
   - Detección automática de preferencias del sistema (`prefers-color-scheme`)
   - Persistencia de preferencias mediante `localStorage`
   - Script inline para evitar parpadeo (FOUC - Flash of Unstyled Content)

2. **Consideraciones de diseño**:
   - Contraste adecuado en ambos temas para mantener WCAG AA/AAA
   - Transiciones suaves entre temas para mejorar la experiencia

**Implementación**:
```html
<script is:inline>
  // Aplicar tema guardado inmediatamente para evitar parpadeo
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Usar tema guardado o preferencia del sistema
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
</script>
```

### 6.3.2 Botón "Volver Arriba"
Componente de navegación que mejora la experiencia de usuario en secciones largas:

1. **Características técnicas:

- Aparición/desaparición automática basada en la posición de scroll
- Animación de desplazamiento suave utilizando scrollTo con behavior: 'smooth'
- Compatibilidad con temas claro/oscuro


2. **Consideraciones de accesibilidad:

- Etiquetas ARIA adecuadas
- Contraste suficiente en ambos temas
- Tamaño de toque optimizado para dispositivos móviles

## 7. Despliegue

### 7.1 Configuración de GitHub Pages

El portafolio se despliega en GitHub Pages con la siguiente configuración:

- URL base: https://edwinwmendeze.github.io/
- Estructura de carpetas: el repositorio nrc-23731 contiene una carpeta grupo-a con el proyecto Astro
- Configuración específica de Astro para compatibilidad con rutas de GitHub Pages

### 7.2 Proceso de CI/CD

El proceso de Integración Continua y Despliegue Continuo (CI/CD) implementado en este proyecto utiliza las funcionalidades de GitHub Actions junto con GitHub Pages:

1. **Integración Continua**:
   - Cada vez que se realiza un push a la rama principal, GitHub Actions ejecuta automáticamente un flujo de trabajo.
   - Se verifica la compilación del proyecto para asegurar que no hay errores.
   - Se ejecutan pruebas básicas de linting y validación de código.

2. **Despliegue Continuo**:
   - Tras validar exitosamente la integración, se genera la versión estática del sitio mediante el comando `astro build`.
   - Los archivos generados se publican automáticamente en GitHub Pages.
   - Este proceso automatizado reduce el tiempo entre los cambios y su publicación, mejorando el ciclo de desarrollo.

La configuración se encuentra en el archivo `.github/workflows/deploy.yml` del repositorio.

## 8. Pruebas Unitarias y TDD

### 8.1 Configuración del entorno de pruebas

Para implementar pruebas unitarias, configuramos Vitest como framework de testing:

```typescript
// vitest.config.ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'node'
  }
});
```

Además, añadimos scripts en `package.json` para facilitar la ejecución de pruebas:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

### 8.2 Proceso TDD (Test-Driven Development)

El desarrollo del ORM siguió estrictamente el ciclo RED-GREEN-REFACTOR:

#### 8.2.1 Fase RED: Pruebas que fallan

Primero escribimos pruebas para funcionalidad que aún no existía:

```typescript
// tests/lib/orm/BaseORM.test.ts
describe('BaseORM', () => {
  describe('initialize()', () => {
    it('debe crear el directorio si no existe', async () => {
      // Simular que el directorio no existe
      vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
      
      await orm.initialize();
      
      // Verificar que se intentó crear el directorio
      expect(fs.mkdir).toHaveBeenCalledWith(testDir, { recursive: true });
    });
  });
});
```

Al ejecutar esta prueba, obtuvimos un error porque BaseORM aún no existía:

```
Error: Cannot find module '../../../src/lib/orm/BaseORM' from 'tests/lib/orm/BaseORM.test.ts'
```

#### 8.2.2 Fase GREEN: Implementación mínima

Implementamos el código mínimo necesario para que las pruebas pasaran:

```typescript
// src/lib/orm/BaseORM.ts
import * as fs from 'fs/promises';
import path from 'path';

export class BaseORM<T extends { id: string }> {
  private basePath: string;
  
  constructor(basePath: string) {
    this.basePath = basePath;
  }
  
  async initialize(): Promise<void> {
    try {
      await fs.access(this.basePath);
    } catch (error) {
      // Directorio no existe, lo creamos
      await fs.mkdir(this.basePath, { recursive: true });
    }
  }
}
```

Con esta implementación, las pruebas pasaron correctamente:

```
✓ tests/lib/orm/BaseORM.test.ts (2 tests) 

Test Files  1 passed (1)
Tests  2 passed (2)
```

#### 8.2.3 Fase REFACTOR: Mejora del código

Finalmente, mejoramos la implementación manteniendo las pruebas exitosas:

```typescript
// Refactorizando initialize() para añadir verificación de estado
async initialize(): Promise<void> {
  if (this.initialized) return;
  
  try {
    await fs.access(this.basePath);
  } catch (error) {
    // Directorio no existe, lo creamos
    await fs.mkdir(this.basePath, { recursive: true });
  }
  
  this.initialized = true;
}
```

### 8.3 Beneficios del enfoque TDD

El desarrollo guiado por pruebas nos proporcionó múltiples ventajas:

1. **Detección temprana de errores**: Los fallos se identifican inmediatamente durante el desarrollo
2. **Diseño más limpio**: El código resultó ser más modular y con mejor separación de responsabilidades
3. **Documentación viva**: Las pruebas sirven como documentación ejecutable del comportamiento esperado
4. **Confianza en refactorizaciones**: Las modificaciones posteriores pueden realizarse con la certeza de que no se romperá la funcionalidad existente

## 9. Buenas Prácticas Implementadas

### 9.1 Prácticas de Desarrollo

- **Código tipado con TypeScript**: Se utilizan interfaces y tipos para definir estructuras de datos, mejorando la detección temprana de errores.

```typescript
// Ejemplo de interfaz de perfil
export interface Profile {
  basics: {
    name: string;
    last_name?: string;
    role: string;
    email?: string;
    image?: string | { local?: string; remote?: string };
    summary?: string;
    location?: { city: string; region: string };
    profiles?: SocialProfile[];
  };
  skills?: string[];
  projects?: Project[];
}
```

- **Componentes modulares**: Cada componente cumple una función específica y es reutilizable.

- **Manejo robusto de errores**: Implementación de estrategias para captura, registro y presentación de errores.

- **Comentarios explicativos**: El código incluye comentarios que explican las decisiones de implementación y el propósito de las funciones.

```javascript
// Ejemplo de componente con comentarios explicativos
// Obtener perfiles de manera segura con manejo de excepciones
let profiles: Profile[] = [];
try {
  profiles = await getProfiles();
} catch (error) {
  console.error('Error al cargar perfiles de equipo:', error);
  // Continuar con array vacío para evitar fallo de la aplicación
}
```

### 9.2 Diseño Responsivo

- **Enfoque mobile-first**: Diseño que prioriza la experiencia en dispositivos móviles y luego se adapta a pantallas más grandes.

- **Media queries**: Implementación de consultas de medios para adaptar la interfaz a diferentes tamaños de pantalla.

```css
@media (max-width: 768px) {
  .team-section {
    padding: 3rem 0 2rem;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
}
```

- **Componentes flexibles**: Elementos que se ajustan automáticamente a distintos tamaños de pantalla mediante CSS Grid y Flexbox.

## 10. Desafíos y Soluciones

### 10.1 Desafíos Encontrados

1. **Problemas con rutas en GitHub Pages**: Se requiere configuración especial para que las rutas funcionen correctamente en el entorno de GitHub Pages.
   - **Solución**: Configuración de Astro modificada para usar la ruta base correcta.

2. **Manejo de errores en componentes**: Inicialmente, los errores en un componente afectaban a toda la aplicación.
   - **Solución**: Implementación de un sistema jerárquico de manejo de errores con ErrorBoundary.

3. **Carga dinámica de perfiles**: Era necesario que el sistema mostrara automáticamente la misma cantidad de perfiles que archivos JSON existentes.
   - **Solución**: Implementación de un servicio que escanea la carpeta de perfiles y carga dinámicamente todos los archivos encontrados.

4. **Configuración de pruebas con mock de módulos ESM**: Durante la implementación de pruebas TDD, surgieron desafíos con el mock de módulos ESM como fs/promises.
   - **Solución**: Configuración específica para Vitest con patrones adecuados de mock para módulos nativos.

5. **Coordinación y organización del equipo**: Uno de los principales desafíos fue coordinar reuniones y llegar a acuerdos sobre aspectos del proyecto, debido a que cada integrante tenía diferentes disponibilidades horarias por motivos laborales, académicos y personales.
   - **Solución**: Se estableció un sistema de comunicación efectiva, con reuniones programadas con anticipación y documentación clara de decisiones tomadas. La paciencia y dedicación de todos los miembros permitió superar estos obstáculos y completar el proyecto satisfactoriamente.

## 11. Conclusiones y Recomendaciones

### 11.1 Logros Alcanzados

- Desarrollo exitoso de un portafolio grupal minimalista y responsivo
- Implementación de un sistema robusto de manejo de errores
- Creación de una estructura de proyecto escalable y mantenible
- Despliegue efectivo en GitHub Pages
- Sistema dinámico para agregar perfiles de equipo mediante archivos JSON
- Implementación de ORM para gestión de datos JSON siguiendo TDD
- Pruebas unitarias con alta cobertura y optimizaciones de rendimiento

### 11.2 Recomendaciones para Futuras Mejoras

1. **Internacionalización**: Implementar soporte para múltiples idiomas.
2. **Modo Oscuro**: Adición de un toggle para cambiar entre modo claro y oscuro.
3. **Filtrado de Proyectos**: Agregar funcionalidad para filtrar proyectos por tecnología o categoría.
4. **Blog Integrado**: Considerar la adición de una sección de blog para compartir conocimientos.
5. **Ampliación de Pruebas**: Extender las pruebas a componentes de UI.
6. **Optimización de imágenes**: Añadir procesamiento automático para optimizar imágenes de perfil.
7. **Expansión del ORM**: Añadir más funcionalidades y soporte para relaciones entre entidades.

---

## 12. Referencias

- [Documentación oficial de Astro](https://docs.astro.build/)
- [GitHub Pages](https://pages.github.com/)
- [Guía de CSS Variables](https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [HTML Elementos Semánticos](https://developer.mozilla.org/es/docs/Web/HTML/Element)
- [Vitest - Framework de pruebas](https://vitest.dev/guide/)
- [Test-Driven Development (TDD)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

*Documento elaborado por: Grupo A - NRC 23731*  
*Última actualización: 24 de abril de 2025*

## 13. Gestión de Código con Git y GitHub

### 13.1 Implementación de GitFlow

El proyecto implementó un flujo de trabajo basado en GitFlow para la gestión del código fuente:

1. **Estructura de ramas**:
   - `main`: Código en producción
   - `develop`: Rama de integración para nuevas características
   - `feature/*`: Ramas para características individuales
   - `release/*`: Ramas para preparar nuevas versiones
   - `hotfix/*`: Ramas para correcciones urgentes en producción

2. **Flujo de trabajo implementado**:
   - Desarrollo de características en ramas independientes (`feature/modo-oscuro`, `feature/volver-arriba`, `feature/orm-tdd`)
   - Integración a `develop` mediante `git flow feature finish`
   - Preparación de releases desde `develop` con `git flow release start/finish`
   - Cada miembro trabajó en sus características asignadas sin interferir con el trabajo de los demás

3. **Gestión de conflictos**:
   - Se utilizó el enfoque de resolución manual cuando surgieron conflictos
   - Se priorizó la conservación de ambas funcionalidades en caso de conflicto
   - Testeo después de cada resolución para verificar la integridad del código

### 13.2 Automatización de CI/CD

Se implementó integración y despliegue continuo mediante GitHub Actions:

1. **Flujo de trabajo**:
   - Verificación automática en cada push a `develop` y `main`
   - Ejecución de pruebas de linting y compilación
   - Despliegue automático a GitHub Pages cuando se actualiza `main`

2. **Beneficios obtenidos**:
   - Detección temprana de errores
   - Despliegue consistente y automático
   - Reducción de errores humanos en el proceso de publicación