# 🎮 RetroHub Server — Guía del Administrador para ROMs y Datos

Servidor: `himawari@192.168.0.131`  
Ruta Raíz: `/home/himawari/retrohub-data/`

---

## 📁 Estructura de Directorios

```
/home/himawari/retrohub-data/
├── roms/                   # Carpetas de juegos por plataforma
│   ├── gba/                # Game Boy Advance (.gba)
│   ├── n64/                # Nintendo 64 (.z64, .n64, .v64)
│   ├── nes/                # Nintendo Entertainment System (.nes)
│   ├── snes/               # Super Nintendo (.sfc, .smc)
│   ├── segaMD/             # Sega Mega Drive / Genesis (.md, .bin, .gen)
│   ├── psx/                # PlayStation 1 (.chd, .iso, .bin, .cue, .pbp)
│   ├── gb/                 # Game Boy / Color (.gb, .gbc)
│   ├── nds/                # Nintendo DS (.nds)
│   ├── psp/                # PlayStation Portable (.iso, .cso)
│   ├── arcade/             # Arcade (.zip, .7z)
│   └── atari2600/          # Atari 2600 (.a26, .bin)
├── covers/                 # Carátulas de juegos (.png, .jpg)
├── cartridges/             # Gráficos de cartuchos y discos (.png, .svg)
├── uploads/                # Avatares y banners de usuarios
├── database/               # Base de datos relacional SQLite
│   └── retrohub.sqlite     # Base de datos maestra
├── scripts/                # Scripts de automatización
│   └── scanner.py          # Escaneador automático de ROMs y metadatos
└── catalogo.json           # Catálogo unificado generado automáticamente
```

---

## 🕹️ Cómo Añadir un Juego Nuevo (Convención de Nombres)

1. **Copiar la ROM a su carpeta correspondiente**:
   * Ejemplo para un juego de SNES:
     ```bash
     scp "Super Mario World.sfc" himawari@192.168.0.131:/home/himawari/retrohub-data/roms/snes/
     ```
2. **(Opcional) Copiar la carátula**:
   * Coloca la imagen en `/home/himawari/retrohub-data/covers/` con el nombre del juego (por ejemplo `super_mario_world.png`).
3. **Ejecutar el escáner**:
   * Desde tu terminal:
     ```bash
     ssh himawari@192.168.0.131 "python3 /home/himawari/retrohub-data/scripts/scanner.py"
     ```
   * O directamente desde la aplicación web pulsando el botón **"Sincronizar Servidor"**.
4. ¡Listo! El juego aparecerá automáticamente en la repisa de la consola correspondiente y en la biblioteca.
