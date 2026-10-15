# 🎮 RetroHub — Contexto Completo del Proyecto & Diagnóstico Técnico

> **Fecha de Análisis:** Octubre 2026  
> **Estado del Repositorio:** Rama `main` (limpia, sincronizada con origin)  
> **URL Producción:** [https://fokinkaii.github.io/retrohub/](https://fokinkaii.github.io/retrohub/)

---

## 1. Resumen Ejecutivo del Proyecto

**RetroHub** es una plataforma web y de escritorio orientada a la emulación y disfrute de videojuegos retro clásicos en el navegador. Visualmente está inspirada en la interfaz del sistema operativo de **Nintendo Switch (Switch OS)** fusionada con elementos estéticos **iiSU Clean / Frutiger Aero** (acrílicos translúcidos, auras bioluminiscentes, sonido sintetizado háptico y navegación por cruceta/mando).

El proyecto fue originalmente derivado del núcleo de **EmulatorJS v4** (un frontend web para RetroArch compilado a WebAssembly) y ha evolucionado mediante capas sucesivas de desarrollo hacia una experiencia completa con:
- Catálogo interactivo de consolas con repisa de juegos dinámicos ("shelf") animada estilo muelle/resorte.
- Biblioteca de empaques 3D de cajas originales de videojuegos.
- Sistema de perfil de jugador gamer estilo Switch OS con identificador de amigo `SW-XXXX-XXXX-XXXX`, horas jugadas y auras visuales personalizables.
- Red social en tiempo real (amistades, presencia, solicitudes y chat P2P).
- Motor de sonido nativo sin dependencias externas (sintetizador Web Audio API de música de consolas y efectos 3DS).
- Soporte dual de despliegue: Estático para **GitHub Pages** (vía Service Worker) y Servidor local con base de datos **SQLite** (Python o Node.js).

---

## 2. Diagnóstico del Sistema de Incidencias / Sugerencias

### ¿Dónde se guardan las incidencias y cuál es su estado actual?
Tras una auditoría minuciosa del historial de Git y de los archivos en disco:

1. **Persistencia 100% en el Navegador (`localStorage`):**
   El sistema de incidencias/sugerencias implementado históricamente (commits `4c8b49b` a `08f95d9`) **nunca se guardó en el servidor ni en un archivo local**. Se guardaba exclusivamente en el almacenamiento local del navegador web bajo la clave:
   ```javascript
   localStorage.getItem('retrohub_sugerencias_guardadas')
   ```
   (Se almacenaba un array JSON con los últimos 30 registros).

2. **Canales de envío que utilizaba:**
   - **WhatsApp:** Generaba un enlace `https://api.whatsapp.com/send?text=...` con el formato del ticket.
   - **Correo Electrónico:** Generaba un enlace `mailto` o webmail de Gmail dirigido a `saragomezmanzanares@gmail.com`.
   - **Web / FormSubmit:** Realizaba un `POST` a la API de `formsubmit.co`.
   - **Portapapeles:** Copiaba la ficha textual de la petición.

3. **Desaparición en la interfaz actual:**
   En el commit `b0d8ed2` (*"feat: Biblioteca 3D de cajas, Pasaporte VIP, selector de aura/titulo/avatar y todas las funciones JS del launcher"*), el modal de sugerencias (`#modal-sugerencias`) y su botón en la barra superior fueron retirados durante la remodelación visual de la interfaz.
   - En la base de datos `retrohub_master.sqlite` **no existe ninguna tabla de incidencias o reportes**.
   - En el disco local **no hay ningún archivo JSON o log con los tickets**.
   - **Si enviaste o guardaste incidencias en tu navegador**, las puedes recuperar inspeccionando las Developer Tools de tu navegador (`F12` > pestaña *Application/Aplicación* > *Local Storage* > clave `retrohub_sugerencias_guardadas`).

> [!IMPORTANT]
> Se recomienda crear formalmente una tabla `tickets` o `issues` en `retrohub_master.sqlite` y un endpoint API dedicado (`/api/tickets`) para que las incidencias queden registradas de manera persistente y centralizada en el servidor.

---

## 3. Pila Tecnológica & Arquitectura del Sistema

El proyecto opera con una arquitectura multicapa:

```
┌─────────────────────────────────────────────────────────────┐
│                    RETROHUB FRONTEND                        │
│  - index.html (Launcher Switch OS + Carousels + Repisa)     │
│  - profile.html (Switch User Profile + Play Activity)       │
│  - player.html (Iframe contenedor EmulatorJS / Canvas)      │
│  - login.html & iisu_network.html (Social OS Hub)           │
│  - retrohub_client.js / retro_music.js / nintendo3ds_*.js   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     [Despliegue Estático]          [Despliegue Local Full]
               │                              │
               ▼                              ▼
    ┌──────────────────────┐      ┌───────────────────────────┐
    │     GitHub Pages     │      │     Backend Server        │
    │  - coi-serviceworker │      │  - server.py (Python 3)   │
    │  - CDN unpkg/dicebear│      │  - backend/server.js (Node│
    │  - LocalStorage / P2P│      │  - retrohub_master.sqlite │
    └──────────────────────┘      └───────────┬───────────────┘
                                              │
                                              ▼
                                  ┌───────────────────────────┐
                                  │   SQLite Database (v3)    │
                                  │   13 tablas maestras      │
                                  └───────────────────────────┘
```

### Componentes Clave:

| Componente | Tecnologías | Propósito |
|---|---|---|
| **Motor de Emulación** | WebAssembly (Emscripten), WebGL, Web Audio, EmulatorJS v4 | Ejecuta cores de RetroArch en el navegador. Cores configurados: `n64` (ParaLLEl / Mupen64Plus-Next), `gba`, `nes`, `snes`, `genesis`, `ps1`, etc. |
| **Frontend Principal** | HTML5, CSS3 Glassmorphism, Vanilla JS, Web Audio API | `index.html` (7.657 líneas) controla la repisa de juegos Switch, Joy-Cons dinámicos, fondos reactivos, tilt 3D y navegación por mando Gamepad API. |
| **Perfil & Red Social** | React 18 (Babel Standalone in-browser), Socket.io, PeerJS | `profile.html` y `IisuProfile.jsx` renderizan la tarjeta de usuario, log de juego, friend code y auras. `iisu_network.html` gestiona amigos y chat. |
| **Servidor Python** | Python 3 (`http.server`, `socketserver`, `sqlite3`, `hmac`) | `server.py` (961 líneas) sirve archivos con cabeceras COOP/COEP para multihilo WebAssembly y replica la API REST de autenticación y perfiles sin requerir Node.js. |
| **Servidor Node.js** | Node.js 24 (`node:sqlite`, Express, Socket.io, bcryptjs, JWT) | `backend/server.js` (1.787 líneas) motor de tiempo real para presencia online, sincronización de juego activo y chat de amigos. |
| **Base de Datos** | SQLite (`retrohub_master.sqlite`) | 13 tablas relacionales: `users`, `profiles`, `emulators`, `user_emulator_preferences`, `friend_requests`, `friendships`, `blocks`, `privacy_settings`, `presences`, `notifications`, `direct_messages`, `rom_library`. |

---

## 4. Estructura de Directorios del Repositorio

```
retrohub/
├── assets/                    # Assets del cliente web
│   ├── retrohub_client.js     # Cliente API, login, sesión y Socket.io
│   ├── retro_music.js         # Sintetizador procedural Web Audio de temas de consolas
│   └── uploads/               # Fotos de perfil y banners subidos localmente
├── backend/                   # Servidor Node.js
│   ├── package.json           # Dependencias (express, socket.io, bcryptjs, jsonwebtoken, mysql2)
│   ├── server.js              # Servidor Node.js principal con node:sqlite
│   └── himawari_server.js     # Prototipo alternativo de servidor para launcher handheld
├── core/                      # [Arquitectura Modular / En Desarrollo]
│   ├── backend/
│   │   ├── engine_server.py   # Servidor HTTP 206 Partial Content para streaming (puerto 8085)
│   │   └── ipc_bridge.ts      # Puente IPC para empaquetado en Electron / Tauri v2
│   ├── frontend/src/          # Componentes React TSX (Carousels, HUD, CoverFlow, Hooks)
│   ├── themes/                # 6 temas en JSON (frutiger_aero, y2k_cyberia, sonic, etc.)
│   └── types/engine.ts        # Definiciones de tipos TypeScript completas
├── data/                      # Núcleo de emulación EmulatorJS
│   ├── loader.js              # Cargador dinámico de núcleos WASM
│   ├── emulator.js / min.js   # Wrapper del motor RetroArch
│   ├── shaders.js             # Shaders CRT, Scanlines y filtros gráficos
│   └── localization/          # Archivos de traducción i18n en JSON
├── docs/                      # Identidad gráfica (Logos, favicons, guías de contribuidores)
├── Emuladores/                # [HURÉFANO / CÓDIGO MUERTO]
│   └── higan-master/          # Código fuente C++ de higan (~100MB sin compilar, no usado por la web)
├── ROMS/                      # Catálogo y almacenamiento de juegos
│   ├── catalogo.json          # Metadatos de ROMs disponibles por consola
│   ├── cartridges/            # Gráficos de cartuchos físicos y discos (PNG/SVG)
│   ├── consoles/              # Iconos de consolas
│   ├── covers/                # Carátulas oficiales en alta resolución
│   └── [gba, n64, nes, ...]   # Archivos de ROMs reales (.gba, .z64, .nes)
├── scripts/                   # Scripts auxiliares para descarga de carátulas, wallpapers y validación
├── index.html                 # Launcher principal estilo Nintendo Switch OS (7.657 líneas)
├── profile.html               # Página de perfil estilo Switch OS (React 18)
├── login.html                 # Pantalla de inicio de sesión y registro
├── player.html                # Contenedor iframe de ejecución del emulador
├── iisu_network.html          # Hub social y chat
├── server.py                  # Servidor local Python 3 con API REST SQLite
├── retrohub_master.sqlite     # Base de datos SQLite maestra
├── actualizar_catalogo.py     # Script para regenerar catalogo.json a partir de la carpeta ROMS
├── build_index.py             # [PELIGRO] Generador desactualizado de index.html
├── iniciar_servidor.bat       # Script batch para arrancar 'python server.py'
└── subir_parche.bat           # Script batch para desplegar a GitHub Pages
```

---

## 5. Análisis de Deuda Técnica & Puntos a Refactorizar

Aquí se detallan los problemas estructurales detectados durante el análisis:

### 🔴 Crítico 1: Monolito inmanejable en `index.html` (7.657 líneas)
- **Problema:** En un único archivo HTML coexisten:
  - ~4.600 líneas de CSS embebido en `<style>`.
  - ~670 líneas de estructura DOM y modales superpuestos.
  - ~2.380 líneas de JavaScript puro en etiquetas `<script>`.
- **Riesgo:** Dificultad para mantener el código, riesgo constante de regresiones visuales, colisiones de variables globales y tiempos de carga elevados.
- **Solución recomendada:** Desacoplar en archivos independientes (`switch_os.css`, `shelf_carousel.js`, `gamepad_controller.js`, `modals.js`).

### 🔴 Crítico 2: Script destructivo `build_index.py`
- **Problema:** El archivo `build_index.py` contiene un string estático con una versión antigua de `index.html` (de 3.500 líneas). Si alguien ejecuta `python build_index.py`, **sobreescribirá y destruirá más de 4.000 líneas de mejoras recientes** (repisa Switch, Joy-Cons dinámicos, auras, animaciones de resorte).
- **Solución recomendada:** Archivar o eliminar `build_index.py` de inmediato, o actualizarlo para que actúe como bundler real.

### 🔴 Crítico 3: Pérdida de metadatos en `actualizar_catalogo.py`
- **Problema:** `subir_parche.bat` ejecuta en el paso 1 `python actualizar_catalogo.py`. Sin embargo, `actualizar_catalogo.py` reconstruye `catalogo.json` desde cero solo con los nombres de archivo en disco, **eliminando campos existentes como `caratula`, `cartucho`, `genero`, `year` y `fix`**.
- **Solución recomendada:** Modificar el script para que haga un *merge* inteligente preservando los metadatos manuales existentes.

### 🟡 Medio 4: Dualidad y desincronización de Servidores (`server.py` vs `backend/server.js`)
- **Problema:** Existen dos implementaciones distintas del backend:
  - `server.py` (usado por `iniciar_servidor.bat`, no soporta WebSockets reales).
  - `backend/server.js` (Node.js completo con Socket.io para chat y amigos en tiempo real).
  - Tienen secretos JWT distintos (`retrohub-nintendo-clean-secret-key-2025` en Python vs `retrohub-super-secret-master-token-key-2026` en Node), por lo que un token emitido por uno es inválido en el otro.
- **Solución recomendada:** Unificar variables de entorno (`.env`) compartidas y definir un servidor principal canónico.

### 🟡 Medio 5: Múltiples páginas huérfanas / prototipos duplicados
- En la raíz conviven prototipos visuales de versiones anteriores que no se utilizan en la experiencia principal:
  - `home.html` (1.518 líneas)
  - `launcher_aaa.html` (23 KB)
  - `himawari_launcher.html` (27 KB)
  - `living_organism.html` (24 KB)
  - `theme_engine.html` (54 KB)
  - `agnostic_studio.html` (29 KB)
- **Solución recomendada:** Moverlos a una carpeta `legacy/` o `experiments/` para limpiar la raíz del proyecto.

### 🟡 Medio 6: Carpeta `Emuladores/higan-master` innecesaria
- Ocupa cientos de megabytes con código C++ no compilado que no tiene relación alguna con los núcleos WebAssembly que usa el navegador.
- **Solución recomendada:** Eliminarla o añadirla a `.gitignore` si no es requerida para el desarrollo web.

### 🟡 Medio 7: Falta de compilación para React / TypeScript
- `profile.html` utiliza `@babel/standalone` en el navegador para transpilar React en tiempo de ejecución.
- En la raíz hay archivos `.jsx` y `.tsx` (`IisuProfile.jsx`, `IisuNetwork.jsx`, `themeStore.ts`) sin un bundler (Vite / esbuild) que los empaquete.
- **Solución recomendada:** Configurar un entorno Vite ligero si se desea aprovechar React de forma profesional.

---

## 6. Estado de la Base de Datos Local (`retrohub_master.sqlite`)

La base de datos SQLite contiene actualmente los siguientes datos de prueba y producción:
- **`users` (6 usuarios):**
  - ID 2: `Sariwiiwi` (`saragomezmanzanares@gmail.com`) — Cuenta principal.
  - IDs 3 a 7: Cuentas seed de demostración (`saragamer`, `Lucas_Fox`, `PixelQueen`, `CyberKidd`, `Hero_1791908169`).
- **`profiles` (6 perfiles):** Con títulos de honor, auras (`scarlet`, `mint`), avatar y consola favorita.
- **`emulators` (14 consolas registradas):** `n64`, `gba`, `snes`, `nes`, `genesis`, `ps1`, `nds`, `psp`, `arcade`, `atari2600`, etc.
- **`rom_library` (7 juegos en biblioteca):** Paper Mario, Super Mario 64, Anguna, Zelda Ocarina of Time, Sonic 2, Super Mario World, Crash Bandicoot 3.
- **`friendships` / `direct_messages` / `notifications`:** 0 registros (listas para poblar en sesión en vivo con Socket.io).

---

## 7. Próximos Pasos Sugeridos

1. **Definir prioridades de refactorización:**
   - ¿Deseas mantener la arquitectura modular en Vanilla JS limpia o migrar el frontend completo a un bundle moderno con Vite + React?
   - ¿Qué backend prefieres como oficial para el desarrollo local: Python (`server.py`) o Node.js (`backend/server.js`)?
2. **Reactivar y formalizar el Sistema de Incidencias:**
   - Crear la tabla `tickets` en SQLite.
   - Agregar el endpoint en el backend para crear, consultar y listar tickets/sugerencias.
   - Restaurar el modal en la interfaz estilo Switch OS con guardado tanto en LocalStorage como sincronizado en SQLite.
3. **Proteger los datos de catálogo:**
   - Corregir `actualizar_catalogo.py` para evitar que sobreescriba las carátulas y metadatos de las ROMs.
