# Portafolio Grupal - Construcción de Software

## Ramas y despliegue

Este repositorio utiliza dos ramas principales para facilitar la entrega académica y el despliegue público:

- **main**: Rama oficial para la entrega del curso. Incluye configuración para Docker y portabilidad, sin adaptador de Vercel. Es la rama que se debe usar para evaluar el proyecto con Docker.
- **vercel**: Rama para despliegue público en [Vercel](https://vercel.com/). Incluye el adaptador `@astrojs/vercel` en la configuración de Astro para que la web esté siempre online.

### Cambiar de rama

```bash
git checkout main   # Para entorno Docker y entrega oficial
git checkout vercel # Para entorno Vercel y demo online
```

> **Nota para el profesor:**
> La entrega oficial y la evaluación deben realizarse usando la rama `main` y Docker, siguiendo las instrucciones de este README. La rama `vercel` es solo para fines de demostración pública.

---

Repositorio: [edwinwmendeze/nrc-23731](https://github.com/edwinwmendeze/nrc-23731.git)

---

## Descripción

Este proyecto es un **portafolio grupal** desarrollado para el curso de Construcción de Software. Permite enlazar y gestionar portafolios individuales de los integrantes del grupo, e incluye funcionalidades de autenticación (login y registro), pruebas unitarias, y despliegue portable mediante Docker.

---

## Estructura del repositorio

```
nrc-23731/
└── grupo-a/
    ├── src/
    ├── dist/
    ├── package.json
    ├── astro.config.mjs
    ├── dockerfile
    └── ...
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (solo para desarrollo local)
- [Docker](https://www.docker.com/) (para despliegue portable y pruebas en cualquier entorno)
- [Git](https://git-scm.com/) (para clonar el repositorio)

---

## Clonar el repositorio

```bash
git clone https://github.com/edwinwmendeze/nrc-23731.git
cd nrc-23731/grupo-a
```

---

## Ejecución en desarrollo local

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Ejecuta el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El proyecto estará disponible en [http://localhost:4321](http://localhost:4321) (o el puerto que indique la consola).

---

## Ejecución con Docker (recomendado para revisión/corrección)

> **¿Por qué Docker?**  
> Docker garantiza que la aplicación funcione igual en cualquier entorno, sin importar el sistema operativo ni las versiones instaladas. Así, el profesor o cualquier evaluador puede probar el proyecto sin complicaciones ni dependencias adicionales.

### **Pasos:**

1. **Construye la imagen Docker:**
   ```bash
   docker build -t portafolio-grupal .
   ```

2. **Ejecuta el contenedor:**
   ```bash
   docker run -p 4321:4321 portafolio-grupal
   ```

3. **Abre en tu navegador:**
   ```
   http://localhost:4321
   ```

> Si el puerto 4321 está ocupado, puedes cambiar el primer número por otro disponible, por ejemplo:  
> `docker run -p 8080:4321 portafolio-grupal`  
> y abrir `http://localhost:8080`

---

## Pruebas unitarias

El proyecto incluye pruebas unitarias usando [Vitest](https://vitest.dev/).

Para ejecutarlas:

```bash
npm run test
```

---

## Estructura de ramas

- `main`: Rama principal y estable.
- `develop`: Rama de desarrollo.

---

## Importancia de Docker en este proyecto

- **Portabilidad:** Permite ejecutar la aplicación en cualquier sistema operativo sin instalar dependencias adicionales.
- **Reproducibilidad:** El entorno de ejecución es siempre el mismo, evitando problemas de "en mi máquina sí funciona".
- **Facilita la corrección:** El profesor puede evaluar el proyecto de forma rápida y segura.

---

## Solución de problemas (FAQ)

- **El puerto 4321 está ocupado:**  
  Cambia el primer número en el comando `-p`, por ejemplo: `docker run -p 8080:4321 portafolio-grupal`.

- **No se ve la app en el navegador:**  
  Asegúrate de que el build de Docker fue exitoso y que abriste el puerto correcto.

- **Error de permisos en Docker:**  
  Ejecuta el comando con permisos de administrador o revisa la configuración de Docker Desktop.

---

## ¿Cómo contribuir?

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz un pull request a la rama `develop`.

---

## Persistencia de datos (opcional)

Para mantener los datos de usuarios entre reinicios del contenedor, puedes montar un volumen Docker:

```bash
docker run -p 4321:4321 -v $(pwd)/src/data:/app/src/data portafolio-grupal
```

---

## Informe técnico

El informe técnico se encuentra en `src/pages/informe-tecnico-pa3.astro` y describe el proceso de desarrollo, pruebas y despliegue del proyecto.

---

## Enlaces útiles

- [Repositorio en GitHub](https://github.com/edwinwmendeze/nrc-23731.git)
- [Documentación oficial de Astro](https://docs.astro.build/)
- [Documentación oficial de Docker](https://docs.docker.com/)

---

## Autores

- Edwin Mendez y equipo (ver sección de colaboradores en GitHub)

---

## Licencia

Este proyecto es solo para fines educativos.
