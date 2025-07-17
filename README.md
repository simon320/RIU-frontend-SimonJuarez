# 🚀 Mindata Frontend Challenge – Hero Management App

Este proyecto es una solución al challenge técnico solicitado por Mindata, desarrollado con Angular 19, siguiendo las últimas recomendaciones del framework (standalone components, signals API, inject API, lazy loading) y prácticas de desarrollo profesional.

---

## 🧱 Tecnologías

- **Angular 19** (standalone + signals)
- **Angular Material**
- **RxJS**
- **Karma + Jasmine** (coverage 100%)
- **Docker**
- **TypeScript**

---

## ⚙️ Features implementadas

### 🧩 Arquitectura

- ✅ Estructura modular, standalone, limpia y escalable
- ✅ Lazy loading por rutas

### 🦸 Gestión de héroes

- ✅ Listado con paginación (`MatPaginator`)
- ✅ Filtrado por nombre en tiempo real
- ✅ Creación y edición con formulario reactivo (`ReactiveForms`)
- ✅ Redirección si no existe el héroe a editar
- ✅ Confirmación con `MatDialog` antes de eliminar
- ✅ Snackbars de feedback tras crear, editar o borrar
- ✅ Todos los textos formateados en mayúscula usando una directiva personalizada

### 🧪 Testing

```bash
npm run test:coverage
```
- ✅ 100% de cobertura de código.
- ✅ Tests unitarios con **Karma + Jasmine**

### 💡 Experiencia de usuario

- ✅ Carga simulada al crear o editar héroe (`setTimeout`)
- ✅ Servicio `LoadingService` para mostrar/hidear un loading global
- ✅ Interceptor HTTP para activar automáticamente loading al detectar peticiones. ( se creo e implemento, pero al no haber peticiones HTTP reales se usa el LoadingService directamente en los metodos donde se necesita).

### 🛠️ Docker

Dockerfile multi-stage y NGINX para producción:

```bash
# 1. Construir la imagen
npm run docker:build

# 2. Ejecutar el contenedor
npm run docker:run

# 3. Ir al navegador:
# http://localhost:8080
```


```Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --output-path=dist

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
