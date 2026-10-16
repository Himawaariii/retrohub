# Carpeta de Audios Reales por Consola (`audios/`)

Coloca aquí tus archivos `.mp3` (también soporta `.ogg`, `.wav` y `.m4a`) para que suenen automáticamente al seleccionar cada consola en el anillo principal de `index.html`.

## Dos formas de añadir audios (ambas funcionan automáticamente)

### Opción A — Archivo directo con el ID de la consola en `audios/`:
- `audios/n64.mp3` (Nintendo 64)
- `audios/gba.mp3` (Game Boy Advance)
- `audios/snes.mp3` (Super Nintendo)
- `audios/nes.mp3` (Nintendo NES)
- `audios/genesis.mp3` (Sega Mega Drive / Genesis)
- `audios/ps1.mp3` (PlayStation 1)
- `audios/nds.mp3` (Nintendo DS)
- `audios/psp.mp3` (PlayStation Portable)
- `audios/gbc.mp3` (Game Boy Color)
- `audios/gb.mp3` (Game Boy Clásica)
- `audios/sms.mp3` (Sega Master System)
- `audios/gamegear.mp3` (Sega Game Gear)
- `audios/atari2600.mp3` (Atari 2600)
- `audios/arcade.mp3` (Arcade / Neo Geo)

### Opción B — Carpeta por consola (`audios/<consola>/cualquier_nombre.mp3`):
Puedes soltar cualquier archivo `.mp3` con el nombre que quieras dentro de la subcarpeta de la consola (por ejemplo `audios/n64/dire_dire_docks.mp3`) y el servidor lo detectará automáticamente a través de `/api/audios`.
