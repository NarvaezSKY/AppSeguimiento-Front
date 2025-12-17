# Sistema de Seguimiento Plan Operativo CMR

Sistema web para el seguimiento y gestión de evidencias del Plan Operativo de la CMR (Comisión de Regulación de Comunicaciones), permitiendo el registro, visualización y control de actividades, componentes y entregas de evidencias.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Manual de Usuario](#-manual-de-usuario)
- [Documentación Técnica](#-documentación-técnica)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 🎯 Descripción General

### ¿Qué es la aplicación?

Es un sistema de gestión y seguimiento de evidencias del Plan Operativo que permite:
- Registrar y dar seguimiento a actividades y componentes del plan operativo
- Gestionar evidencias de cumplimiento de actividades
- Visualizar el estado de las entregas en tiempo real
- Generar reportes y análisis mediante Power BI
- Consultar perfiles de usuarios con sus evidencias asociadas

### ¿Para qué sirve?

- **Control de cumplimiento**: Monitorear el estado de las actividades del plan operativo
- **Gestión de evidencias**: Registrar, actualizar y consultar evidencias de entrega
- **Seguimiento personalizado**: Filtrar por componente, usuario, trimestre o estado
- **Análisis visual**: Visualizar distribución de estados mediante gráficos y reportes de Power BI
- **Trazabilidad**: Mantener historial de responsables y entregas

### Público Objetivo

- **Usuarios/Responsables**: Personal que registra y entrega evidencias de actividades
- **Coordinadores**: Supervisores que consultan y validan el cumplimiento de entregas
- **Administradores**: Gestores del sistema que crean componentes, actividades y usuarios

---

## 👥 Manual de Usuario

### Flujo General de Uso

1. **Inicio de sesión** → Acceso al sistema mediante email y contraseña
2. **Dashboard principal** → Vista de componentes y navegación rápida
3. **Gestión de evidencias** → Registro, consulta y actualización de evidencias
4. **Perfil de usuario** → Visualización de evidencias personales y estadísticas
5. **Reportes** → Análisis mediante Power BI integrado

---

### 🔐 Pantallas Principales

#### 1. Login (Autenticación)

**Ruta**: `/login`

Pantalla de inicio de sesión donde el usuario ingresa sus credenciales:
- **Email**: Correo electrónico registrado
- **Contraseña**: Contraseña de acceso

Una vez autenticado, el sistema guarda el token de sesión y redirige al dashboard principal.

---

#### 2. Dashboard de Componentes (Home)

**Ruta**: `/`

Pantalla principal que muestra todos los componentes del plan operativo:
- **Vista de tarjetas**: Cada tarjeta representa un componente
- **Información mostrada**:
  - Nombre del componente
  - Número de actividades asociadas
  - Número de responsables
  - Acciones disponibles (ver actividades, ver responsables)
- **Acciones disponibles**:
  - Ver actividades del componente
  - Ver responsables del componente
  - Crear nuevo componente (administradores)

---

#### 3. Evidencias

**Ruta**: `/evidences`

Gestión completa de evidencias con:

##### Filtros disponibles:
- Por **componente**
- Por **usuario/responsable**

##### Información mostrada en cada evidencia:
- Estado de la entrega (chip de color)
- Nombre del componente
- Actividad asociada
- Meta anual
- Responsables asignados
- Mes y trimestre de entrega
- Fecha de entrega programada
- Justificación (si aplica)

##### Acciones disponibles:
- **Actualizar estado**: Cambiar el estado de la evidencia (Entregada, Por entregar, Entrega extemporánea, No logro)
- **Ver detalles**: Modal con información completa
- **Subir evidencia**: Botón para crear nueva evidencia

##### Paginación:
- Control de registros por página (10, 20, 50)
- Navegación entre páginas
- Indicador de página actual y total

##### Estados de evidencias:
- 🟢 **Entregada**: Evidencia entregada en tiempo
- 🟡 **Entrega extemporánea**: Entregada fuera de plazo
- 🔴 **Por entregar**: Pendiente de entrega
- ⚫ **No logro**: Actividad no completada

---

#### 4. Subir Evidencia

**Ruta**: `/evidences/upload`

Formulario para registrar nuevas evidencias:

**Campos requeridos**:
- Componente (selección)
- Actividad (selección dependiente del componente)
- Mes de entrega
- Año
- Trimestre
- Estado
- Responsables (selección múltiple)
- Justificación (opcional)
- Fecha de entrega

---

#### 5. Perfil de Usuario

**Ruta**: `/users/:userId`

Vista personalizada de cada usuario con:

##### Información personal:
- Foto de perfil
- Nombre completo
- Email
- Tipo de vinculación (Planta, Contratista, etc.)

##### Filtros:
- Por **componente**
- Por **actividad**
- Por **estado**
- Por **trimestre**

##### Visualizaciones:
- **Tarjetas de evidencias**: Todas las evidencias del usuario
- **Gráfico circular**: Distribución de evidencias por estado
- **Estadísticas**: Porcentajes y cantidades por estado

---

#### 6. Responsables por Componente

**Ruta**: `/:componentId/responsables`

Lista de usuarios que tienen evidencias en un componente específico:
- Foto de perfil (cuando está disponible)
- Nombre completo
- Tipo de vinculación
- Email
- Click en tarjeta redirige al perfil del usuario

---

#### 7. Reporte Power BI

**Ruta**: `/reporte`

Integración con Power BI para análisis avanzados:
- Dashboard embebido con visualizaciones
- Link para abrir en Power BI (nueva pestaña)
- Reportes de seguimiento del Plan Operativo

---

### 📊 Tipos de Usuario y Permisos

#### Usuario Estándar (Responsable)
- ✅ Ver componentes y actividades
- ✅ Consultar evidencias
- ✅ Ver su perfil personal
- ✅ Acceder a reportes

#### Usuario Administrador
- ✅ Todos los permisos de usuario estándar
- ✅ Crear nuevos componentes
- ✅ Crear nuevas actividades
- ✅ Registrar nuevas evidencias
- ✅ Actualizar estado de evidencias
- ✅ Gestionar usuarios

---

### 🎓 Ejemplos de Uso Paso a Paso

#### Ejemplo 1: Consultar mis evidencias

1. Iniciar sesión con tus credenciales
2. Hacer clic en tu nombre en la barra superior
3. Se muestra tu perfil con todas tus evidencias
4. Usar filtros para encontrar evidencias específicas (por componente, actividad, estado o trimestre)
5. Ver gráfico de distribución de tus entregas

#### Ejemplo 2: Registrar una nueva evidencia

1. Desde el menú lateral, seleccionar "Subir evidencia"
2. Completar el formulario:
   - Seleccionar el componente
   - Seleccionar la actividad
   - Indicar mes, año y trimestre
   - Seleccionar estado inicial
   - Asignar responsables
   - Añadir justificación si es necesario
   - Definir fecha de entrega
3. Hacer clic en "Guardar"
4. La evidencia aparecerá en el listado general

#### Ejemplo 3: Actualizar el estado de una evidencia

1. Ir a "Evidencias" en el menú
2. Localizar la evidencia a actualizar
3. Hacer clic en el menú de opciones (tres puntos) de la tarjeta
4. Seleccionar "Cambiar estado"
5. Elegir el nuevo estado en el dropdown
6. El cambio se guarda automáticamente

#### Ejemplo 4: Ver evidencias de un componente específico

1. Desde el dashboard principal, hacer clic en un componente
2. Seleccionar "Ver actividades"
3. Se filtrarán automáticamente las evidencias de ese componente
4. También se puede acceder a "Ver responsables" para conocer quiénes trabajan en el componente

---

## 🛠️ Documentación Técnica

### Arquitectura General

```
┌─────────────────┐      HTTPS/REST API      ┌──────────────────┐
│   FRONTEND      │ ◄─────────────────────► │    BACKEND       │
│   React + Vite  │      (axios + JWT)       │  (API REST)      │
│   TypeScript    │                          │                  │
└─────────────────┘                          └──────────────────┘
                                                      │
                                                      ▼
                                             ┌──────────────────┐
                                             │   BASE DE DATOS  │
                                             │   (MongoDB)      │
                                             └──────────────────┘
```

**Flujo de datos**:
1. Usuario interactúa con la interfaz (React)
2. Acciones disparan casos de uso (Clean Architecture)
3. Repositorios se comunican con el backend vía HTTP
4. Interceptores añaden el token JWT a cada request
5. Backend procesa y retorna datos en formato JSON
6. Estado global se actualiza (Zustand)
7. Componentes React se re-renderizan

---

### 🚀 Tecnologías Usadas

#### Frontend

**Framework y Entorno**:
- ⚛️ **React 18.3.1**: Librería principal para UI
- ⚡ **Vite 6.0.11**: Build tool y dev server ultra rápido
- 📘 **TypeScript 5.6.3**: Tipado estático

**UI y Estilos**:
- 🎨 **HeroUI 2.8.3**: Sistema de componentes (basado en NextUI)
- 🎭 **Tailwind CSS 4.1.11**: Utility-first CSS
- 🎬 **Framer Motion 11.18.2**: Animaciones fluidas
- 🎯 **Tailwind Variants**: Variantes de estilos reutilizables

**Enrutamiento y Estado**:
- 🧭 **React Router DOM 7.8.2**: Navegación SPA
- 🐻 **Zustand 5.0.8**: Estado global minimalista

**Formularios y Comunicación**:
- 📝 **React Hook Form 7.62.0**: Gestión de formularios performante
- 🌐 **Axios 1.11.0**: Cliente HTTP

**Utilidades**:
- 🔔 **Sonner 2.0.7**: Notificaciones toast elegantes
- 🎨 **Lucide React 0.542.0**: Iconos
- 🎨 **React Icons 5.5.0**: Librería de iconos adicional
- 🔧 **clsx 2.1.1**: Manejo de clases condicionales

**Desarrollo**:
- 🧹 **ESLint + Prettier**: Linter y formateador
- 📦 **TypeScript ESLint**: Reglas para TS

---

#### Backend (inferido del código)

- 🟢 **Node.js**: Runtime JavaScript
- 🛤️ **Express** (probable): Framework web
- 🍃 **MongoDB**: Base de datos NoSQL
- 🔐 **JWT**: Autenticación basada en tokens
- 📊 **Power BI**: Integración para reportes avanzados

---

### 📁 Estructura de Carpetas (Explicada)

El proyecto sigue **Clean Architecture** separando capas de dominio, aplicación e infraestructura:

```
src/
├── assets/              # Recursos estáticos (imágenes, perfiles)
│   └── profiles/        # Fotos de perfil de usuarios
│
├── components/          # Componentes globales reutilizables
│   ├── icons.tsx        # Componentes de iconos personalizados
│   ├── navbar.tsx       # Barra de navegación superior
│   ├── sidebar.tsx      # Menú lateral desplegable
│   ├── theme-switch.tsx # Switch de modo claro/oscuro
│   └── primitives.ts    # Variantes base de Tailwind
│
├── config/              # Configuraciones del proyecto
│   ├── config.ts        # Variables de entorno y URLs
│   ├── instance.ts      # Instancia configurada de Axios
│   ├── site.ts          # Configuración del sitio
│   └── interceptors/    # Interceptores HTTP
│       ├── index.ts     # Exportaciones centralizadas
│       ├── request.ts   # Interceptor de peticiones (añade JWT)
│       └── response.ts  # Interceptor de respuestas (manejo de errores)
│
├── core/                # Lógica de negocio (Clean Architecture)
│   ├── auth/            # Módulo de autenticación
│   │   ├── application/ # Casos de uso
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   └── verify.use-case.ts
│   │   ├── domain/      # Interfaces y contratos
│   │   │   ├── auth.repository.ts
│   │   │   ├── login/   # DTOs de login
│   │   │   ├── register/ # DTOs de registro
│   │   │   └── verify/  # DTOs de verificación
│   │   └── infrastructure/ # Implementación de repositorios
│   │       └── auth.repository.ts
│   │
│   ├── tasks/           # Módulo de tareas y evidencias
│   │   ├── application/ # Casos de uso
│   │   │   ├── get-actividades-by-responsable.use-case.ts
│   │   │   ├── get-all-evidences.use-case.ts
│   │   │   ├── get-components-by-responsable.use-case.ts
│   │   │   ├── get-components.use-case.ts
│   │   │   ├── get-user-by-component.use-case.ts
│   │   │   ├── update-evidence.use-case.ts
│   │   │   ├── upload-activity.use-case.ts
│   │   │   ├── upload-component.use-case.ts
│   │   │   └── upload-evidence.use-case.ts
│   │   ├── domain/      # Interfaces y DTOs
│   │   │   ├── tasks.repository.ts
│   │   │   ├── get-actividades-by-responsable/
│   │   │   ├── get-components/
│   │   │   ├── get-evidences/
│   │   │   ├── update-evidence/
│   │   │   ├── upload-activity/
│   │   │   ├── upload-component/
│   │   │   └── upload-evidence/
│   │   └── infrastructure/
│   │       └── tasks.repository.ts
│   │
│   └── users/           # Módulo de usuarios
│       ├── application/ # Casos de uso de usuarios
│       │   ├── get-all-users.use-case.ts
│       │   └── upload-user.use-case.ts
│       ├── domain/      # Interfaces de usuarios
│       │   ├── users.repository.ts
│       │   ├── get-all-users/
│       │   └── upload-user/
│       └── infrastructure/
│
├── layouts/             # Layouts de página
│   └── default.tsx      # Layout principal con navbar y sidebar
│
├── pages/               # Páginas/rutas de la aplicación
│   ├── evidences/       # Módulo de evidencias
│   │   ├── index.tsx    # Listado de evidencias
│   │   ├── components/  # Componentes del módulo
│   │   ├── hooks/       # Custom hooks (useHome, filtros, etc.)
│   │   └── upload/      # Subir nueva evidencia
│   │
│   ├── home/            # Dashboard principal
│   │   ├── index.tsx
│   │   ├── components/  # Tarjetas de componentes
│   │   └── hooks/       # useHome hook
│   │
│   ├── login/           # Página de login
│   │   ├── login.tsx
│   │   └── hooks/       # useLogin hook
│   │
│   ├── PowerBI/         # Integración con Power BI
│   │   └── index.tsx
│   │
│   ├── profiles/        # Perfiles de usuario
│   │   ├── index.tsx
│   │   ├── Components/  # EstadoGraphics (gráfico circular)
│   │   ├── hooks/       # useProfile hook
│   │   └── utils/
│   │
│   └── usersByComponent/ # Usuarios por componente
│       ├── index.tsx
│       └── hooks/
│
├── shared/              # Recursos compartidos
│   ├── components/      # Componentes reutilizables
│   │   ├── EvidenceCard.tsx # Tarjeta de evidencia
│   │   └── Modal.tsx    # Modal genérico
│   └── utils/           # Utilidades globales
│
├── store/               # Estado global (Zustand)
│   ├── auth.store.tsx   # Estado de autenticación
│   ├── tasks.store.tsx  # Estado de tareas/evidencias
│   └── users.store.tsx  # Estado de usuarios
│
├── styles/              # Estilos globales
│   └── globals.css      # Estilos CSS globales
│
├── types/               # Tipos TypeScript globales
│   └── index.ts
│
├── App.tsx              # Componente raíz con rutas
├── main.tsx             # Punto de entrada de React
├── ProtectedRoute.tsx   # HOC para rutas protegidas
├── PublicRoute.tsx      # HOC para rutas públicas
└── provider.tsx         # Providers globales
```

---

### 🔌 Principales Endpoints (inferidos)

**Base URL**: Configurada en `VITE_API_URL_PROD`

#### Autenticación
```
POST   /auth/login        - Iniciar sesión
POST   /auth/register     - Registrar usuario
GET    /auth/verify       - Verificar token JWT
```

#### Componentes
```
GET    /componentes       - Obtener todos los componentes
POST   /componentes       - Crear nuevo componente
```

#### Actividades
```
POST   /actividades       - Crear nueva actividad
```

#### Evidencias
```
GET    /evidencias?...    - Obtener evidencias con filtros
POST   /evidencias        - Crear nueva evidencia
PATCH  /evidencias/:id/estado - Actualizar estado de evidencia
```

**Parámetros de filtro disponibles**:
- `actividad`: ID de actividad
- `mes`: Número de mes (1-12)
- `anio`: Año
- `trimestre`: Número de trimestre (1-4)
- `estado`: Estado de la evidencia
- `componente`: ID del componente
- `responsable`: ID del responsable
- `page`: Número de página
- `limit`: Registros por página

---

### 🔐 Autenticación

**Estrategia**: JWT (JSON Web Tokens)

**Flujo de autenticación**:

1. **Login**:
   ```typescript
   POST /auth/login
   Body: { email, password }
   Response: { token, user }
   ```
   El token se almacena en `sessionStorage`

2. **Verificación automática**:
   - Al cargar la app, si existe token, se llama a `/auth/verify`
   - Si el token es inválido, se limpia y redirige a login

3. **Request Interceptor**:
   - Cada petición HTTP incluye automáticamente el header:
   ```
   Authorization: Bearer <token>
   ```

4. **Rutas protegidas**:
   - `<ProtectedRoute>`: Valida token antes de renderizar
   - Si no hay token, redirige a `/login`

5. **Rutas públicas**:
   - `<PublicRoute>`: Si ya hay token, redirige a home

**Almacenamiento**: `sessionStorage` (se limpia al cerrar el navegador)

---

### 📊 Gestión de Estado

**Zustand Stores**:

#### `auth.store.tsx`
```typescript
{
  user: User | null,
  isLoading: boolean,
  error: string | null,
  login(email, password): Promise
  register(data): Promise
  verify(): Promise
  logout(): Promise
}
```

#### `tasks.store.tsx`
```typescript
{
  evidences: Evidence[],
  components: Component[],
  activities: Activity[],
  // ... métodos para CRUD de evidencias
}
```

#### `users.store.tsx`
```typescript
{
  users: User[],
  // ... métodos para gestión de usuarios
}
```

---

### 🏗️ Infraestructura

**Hosting**: Vercel

**Configuración de deploy** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Esto asegura que todas las rutas del cliente sean manejadas por React Router.

**Build**:
- Comando: `npm run build`
- Genera carpeta `dist/` con assets optimizados
- TypeScript compilado y minificado

---

### 🔧 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# URL del backend (requerido)
VITE_API_URL_PROD=https://api.ejemplo.com

# Otras configuraciones opcionales
VITE_APP_NAME=Seguimiento CMR
```

**Uso en código**:
```typescript
import.meta.env.VITE_API_URL_PROD
```

---

## ⚙️ Instalación y Ejecución

### Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior (incluido con Node.js)
- **Git**: Para clonar el repositorio

### Instalación Local

#### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd AppSeguimiento-Front
```

#### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`.

#### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL_PROD=http://localhost:3000
```

Ajustar la URL según la ubicación del backend.

#### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` (o el puerto que indique Vite).

#### 5. Construir para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

#### 6. Previsualizar build de producción

```bash
npm run preview
```

---

### 🐛 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript y construir para producción
npm run build

# Lint y corrección automática de código
npm run lint

# Previsualizar build de producción
npm run preview
```

---

### 🔑 Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL_PROD` | URL base del backend API

---

### 📝 Notas Adicionales

**Navegadores soportados**:
- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)

**Responsive Design**: La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

**Accesibilidad**:
- Navegación por teclado
- Etiquetas ARIA
- Contraste de colores WCAG AA

---

## 📄 Licencia

MIT License

---

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.
seguimientoidiregionalcauca@gmail.com

---

## 🔄 Changelog

### v1.0.0 (Actual)
- ✅ Sistema de autenticación con JWT
- ✅ Gestión completa de evidencias
- ✅ Perfiles de usuario con estadísticas
- ✅ Integración con Power BI
- ✅ Filtros avanzados y paginación
- ✅ Gráficos de distribución de estados
- ✅ Diseño responsive
- ✅ Modo claro/oscuro

---

**Desarrollado para la Coordinación Misional Regional SENA Regional Cauca (CMR)** 🇨🇴
