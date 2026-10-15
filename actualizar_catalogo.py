#!/usr/bin/env python3
"""
Actualizador Inteligente del Catálogo de ROMs de RetroHub
Sincroniza con el servidor remoto 192.168.0.131 si está disponible,
o escanea localmente preservando carátulas, cartuchos y metadatos.
"""

import os
import sys
import json
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
ROMS_DIR = BASE_DIR / "ROMS"
CAT_PATH = ROMS_DIR / "catalogo.json"

# 1. Intentar sincronizar primero con el servidor remoto himawari@192.168.0.131
try:
    from core.server_sync import check_server_status, trigger_remote_scan, sync_catalog_from_server
    status = check_server_status()
    if status.get("online"):
        print("[INFO] Servidor remoto 192.168.0.131 disponible. Ejecutando escaneo remoto...")
        trigger_remote_scan()
        sync_res = sync_catalog_from_server()
        if sync_res.get("success"):
            total = sum(len(v) for v in sync_res["catalog"].values())
            print(f"[OK] Catalogo sincronizado desde el servidor remoto ({total} juegos reales).")
            sys.exit(0)
except Exception as e:
    print(f"[INFO] Servidor remoto no contactado ({e}). Continuando con escaneo local seguro...")

# 2. Escaneo local seguro con preservación de metadatos existentes
consolas = ["arcade", "atari2600", "gb", "gba", "n64", "nds", "nes", "psp", "psx", "segaMD", "snes"]
catalogo_existente = {}

if CAT_PATH.exists():
    try:
        with open(CAT_PATH, "r", encoding="utf-8") as f:
            catalogo_existente = json.load(f)
    except Exception:
        catalogo_existente = {}

catalogo_nuevo = {c: [] for c in consolas}

for c in consolas:
    subdir = ROMS_DIR / c
    if subdir.exists():
        existentes_map = {item.get("nombreArchivo"): item for item in catalogo_existente.get(c, [])}
        for f in sorted(subdir.iterdir()):
            if f.is_file() and not f.name.startswith(".") and not f.name.endswith(".json"):
                rel_path = f"ROMS/{c}/{f.name}"
                titulo = f.stem
                
                # Preservar o inferir carátula y cartucho
                if f.name in existentes_map:
                    entry = existentes_map[f.name]
                    entry["archivo"] = rel_path
                else:
                    entry = {
                        "titulo": titulo,
                        "archivo": rel_path,
                        "nombreArchivo": f.name,
                        "caratula": f"ROMS/covers/{f.stem}.png",
                        "cartucho": f"ROMS/cartridges/cart_{f.stem.lower()}.png",
                        "genero": "Clásico Retro",
                        "year": "Retro",
                        "isPlayable": True
                    }
                catalogo_nuevo[c].append(entry)

with open(CAT_PATH, "w", encoding="utf-8") as f:
    json.dump(catalogo_nuevo, f, indent=2, ensure_ascii=False)

total_local = sum(len(v) for v in catalogo_nuevo.values())
print(f"✅ Catálogo local actualizado sin pérdidas en {CAT_PATH} ({total_local} juegos reales).")
