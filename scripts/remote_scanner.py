#!/usr/bin/env python3
"""
RetroHub Unified ROM & Metadata Scanner Engine
Location: /home/himawari/retrohub-data/scripts/scanner.py
Database: /home/himawari/retrohub-data/database/retrohub.sqlite
Exports:   /home/himawari/retrohub-data/catalogo.json

Administrators simply drop ROM files into /home/himawari/retrohub-data/roms/<system>/
and run this scanner to auto-index all games into SQLite and catalogo.json.
"""

import os
import sys
import json
import sqlite3
import hashlib
import re
from pathlib import Path
from datetime import datetime

DATA_ROOT = Path('/home/himawari/retrohub-data')
ROMS_DIR = DATA_ROOT / 'roms'
COVERS_DIR = DATA_ROOT / 'covers'
CARTS_DIR = DATA_ROOT / 'cartridges'
DB_PATH = DATA_ROOT / 'database' / 'retrohub.sqlite'
CATALOG_PATH = DATA_ROOT / 'catalogo.json'

SYSTEMS_METADATA = {
    "gba": {
        "name": "Game Boy Advance",
        "maker": "Nintendo",
        "year": "2001",
        "color": "#5352ed",
        "core_name": "mgba",
        "extensions": [".gba", ".bin"],
        "order": 1
    },
    "n64": {
        "name": "Nintendo 64",
        "maker": "Nintendo",
        "year": "1996",
        "color": "#ff4757",
        "core_name": "parallel_n64",
        "extensions": [".z64", ".n64", ".v64"],
        "order": 2
    },
    "nes": {
        "name": "Nintendo Entertainment System",
        "maker": "Nintendo",
        "year": "1983",
        "color": "#ff3838",
        "core_name": "fceumm",
        "extensions": [".nes"],
        "order": 3
    },
    "snes": {
        "name": "Super Nintendo",
        "maker": "Nintendo",
        "year": "1990",
        "color": "#6c5ce7",
        "core_name": "snes9x",
        "extensions": [".sfc", ".smc", ".bin"],
        "order": 4
    },
    "segaMD": {
        "name": "Sega Mega Drive",
        "maker": "Sega",
        "year": "1988",
        "color": "#3742fa",
        "core_name": "genesis_plus_gx",
        "extensions": [".md", ".bin", ".gen", ".smd"],
        "order": 5
    },
    "psx": {
        "name": "PlayStation 1",
        "maker": "Sony",
        "year": "1994",
        "color": "#0984e3",
        "core_name": "pcsx_rearmed",
        "extensions": [".chd", ".iso", ".bin", ".cue", ".pbp"],
        "order": 6
    },
    "gb": {
        "name": "Game Boy / Color",
        "maker": "Nintendo",
        "year": "1989",
        "color": "#2ed573",
        "core_name": "gambatte",
        "extensions": [".gb", ".gbc"],
        "order": 7
    },
    "nds": {
        "name": "Nintendo DS",
        "maker": "Nintendo",
        "year": "2004",
        "color": "#ffa502",
        "core_name": "melonds",
        "extensions": [".nds"],
        "order": 8
    },
    "psp": {
        "name": "PlayStation Portable",
        "maker": "Sony",
        "year": "2004",
        "color": "#1e90ff",
        "core_name": "ppsspp",
        "extensions": [".iso", ".cso"],
        "order": 9
    },
    "arcade": {
        "name": "Arcade Classics",
        "maker": "Capcom / SNK / Namco",
        "year": "1985",
        "color": "#e056fd",
        "core_name": "fbneo",
        "extensions": [".zip", ".7z"],
        "order": 10
    },
    "atari2600": {
        "name": "Atari 2600",
        "maker": "Atari",
        "year": "1977",
        "color": "#b71540",
        "core_name": "stella",
        "extensions": [".a26", ".bin"],
        "order": 11
    }
}

def init_db(conn):
    cur = conn.cursor()
    cur.executescript('''
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        username_clean TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY,
        display_name TEXT NOT NULL,
        bio TEXT DEFAULT 'Explorador del multiverso retro.',
        avatar_url TEXT NOT NULL,
        banner_url TEXT NOT NULL,
        title_honor TEXT DEFAULT '🎮 Campeón RetroHub',
        system_aura TEXT DEFAULT 'scarlet',
        favorite_system TEXT DEFAULT 'n64',
        friend_code TEXT UNIQUE,
        social_links TEXT DEFAULT '[]',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY,
        theme TEXT DEFAULT 'iisu_pearl',
        bgm_volume REAL DEFAULT 0.28,
        sfx_volume REAL DEFAULT 0.35,
        crt_shaders INTEGER DEFAULT 0,
        controller_layout TEXT DEFAULT 'nintendo',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS systems (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        maker TEXT,
        release_year TEXT,
        color TEXT,
        core_name TEXT,
        supported_extensions TEXT,
        display_order INTEGER DEFAULT 99
    );

    CREATE TABLE IF NOT EXISTS roms (
        id TEXT PRIMARY KEY,
        system_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        relative_path TEXT NOT NULL,
        title TEXT NOT NULL,
        cover_url TEXT,
        cartridge_url TEXT,
        genre TEXT DEFAULT 'Clásico',
        release_year TEXT DEFAULT 'Retro',
        file_size INTEGER DEFAULT 0,
        sha1 TEXT,
        is_playable INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_game_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        rom_id TEXT NOT NULL,
        minutes_played INTEGER DEFAULT 0,
        last_played_at DATETIME,
        first_played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(rom_id) REFERENCES roms(id) ON DELETE CASCADE,
        UNIQUE(user_id, rom_id)
    );

    CREATE TABLE IF NOT EXISTS friendships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        friend_id INTEGER NOT NULL,
        status TEXT DEFAULT 'accepted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, friend_id)
    );

    CREATE TABLE IF NOT EXISTS direct_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        contact_name TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    ''')

    for sys_id, meta in SYSTEMS_METADATA.items():
        cur.execute('''
        INSERT INTO systems (id, name, maker, release_year, color, core_name, supported_extensions, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            maker = excluded.maker,
            release_year = excluded.release_year,
            color = excluded.color,
            core_name = excluded.core_name,
            supported_extensions = excluded.supported_extensions,
            display_order = excluded.display_order
        ''', (
            sys_id, meta["name"], meta["maker"], meta["year"], meta["color"],
            meta["core_name"], json.dumps(meta["extensions"]), meta["order"]
        ))

    # Único usuario real activo: Sariwiiwi (sin usuarios simulados)
    cur.execute('''
    INSERT INTO users (id, email, username, username_clean, password_hash)
    VALUES (1, 'saragomezmanzanares@gmail.com', 'Sariwiiwi', 'sariwiiwi', 'sha256:retrohub_master_auth')
    ON CONFLICT(email) DO UPDATE SET
        username = excluded.username,
        username_clean = excluded.username_clean
    ''')

    cur.execute('''
    INSERT INTO profiles (user_id, display_name, bio, avatar_url, banner_url, title_honor, system_aura, favorite_system, friend_code)
    VALUES (1, 'Sariwiiwi', 'Coleccionista de joyas en caja original y perseguidora de los 60 FPS.',
            'https://api.dicebear.com/7.x/bottts/svg?seed=SaraRetro',
            'assets/game_wallpapers/n64/sm64.png',
            '🎮 Maestra de los 64-Bits', 'mint', 'n64', 'SW-7824-9102-3318')
    ON CONFLICT(user_id) DO UPDATE SET
        display_name = excluded.display_name,
        bio = excluded.bio,
        friend_code = excluded.friend_code
    ''')

    cur.execute('''
    INSERT INTO user_preferences (user_id, theme, bgm_volume, sfx_volume, crt_shaders, controller_layout)
    VALUES (1, 'iisu_pearl', 0.28, 0.35, 0, 'nintendo')
    ON CONFLICT(user_id) DO NOTHING
    ''')

    conn.commit()

def calculate_sha1(filepath):
    h = hashlib.sha1()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def clean_game_title(raw_name):
    t = re.sub(r'[\(\[].*?[\)\]]', '', raw_name)
    t = t.replace('_', ' ').replace('-', ' ').strip()
    return re.sub(r'\s+', ' ', t)

def scan_roms(conn):
    cur = conn.cursor()
    cur.execute("DELETE FROM roms")
    
    catalog_json = {s: [] for s in SYSTEMS_METADATA.keys()}
    found_count = 0

    KNOWN_COVERS = {
        "papermario": "ROMS/covers/papermario.png",
        "anguna": "ROMS/covers/anguna_box.png",
        "3weeksinparadise": "ROMS/covers/3weeksinparadise.jpg",
        "31in1": "ROMS/covers/31in1.png",
        "3in1": "ROMS/covers/3in1.png"
    }

    KNOWN_CARTS = {
        "papermario": "ROMS/cartridges/cart_papermario.png",
        "anguna": "ROMS/cartridges/cart_anguna.png",
        "3weeksinparadise": "ROMS/cartridges/cart_3weeksinparadise.png",
        "31in1": "ROMS/cartridges/cart_31in1.png",
        "3in1": "ROMS/cartridges/cart_3in1.png"
    }

    for sys_id, meta in SYSTEMS_METADATA.items():
        sys_dir = ROMS_DIR / sys_id
        if not sys_dir.exists():
            sys_dir.mkdir(parents=True, exist_ok=True)
            continue

        for item in sorted(sys_dir.iterdir()):
            if item.is_file() and not item.name.startswith('.'):
                ext = item.suffix.lower()
                if ext in meta["extensions"] or ext in [".gba", ".z64", ".n64", ".v64", ".nes", ".sfc", ".smc", ".bin", ".iso", ".chd"]:
                    file_size = item.stat().st_size
                    sha1_sum = calculate_sha1(item)
                    rom_id = f"rom_{sys_id}_{item.stem.lower()[:24]}"
                    rom_id = re.sub(r'[^a-z0-9_]', '', rom_id)
                    
                    title = clean_game_title(item.stem)
                    rel_path = f"ROMS/{sys_id}/{item.name}"

                    key_search = re.sub(r'[^a-z0-9]', '', item.stem.lower())
                    cover_url = ""
                    for k, v in KNOWN_COVERS.items():
                        if k in key_search:
                            cover_url = v
                            break
                    if not cover_url:
                        cover_url = f"ROMS/covers/box_{sys_id}.png"

                    cart_url = ""
                    for k, v in KNOWN_CARTS.items():
                        if k in key_search:
                            cart_url = v
                            break
                    if not cart_url:
                        cart_url = f"ROMS/cartridges/{sys_id}_clean.png"

                    genre = "RPG / Aventura" if "mario" in title.lower() or "anguna" in title.lower() else "Retro Clásico"
                    year = "2001" if "paper mario" in title.lower() else ("2008" if "anguna" in title.lower() else meta["year"])

                    cur.execute('''
                    INSERT INTO roms (id, system_id, filename, relative_path, title, cover_url, cartridge_url, genre, release_year, file_size, sha1, is_playable)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                    ''', (rom_id, sys_id, item.name, rel_path, title, cover_url, cart_url, genre, year, file_size, sha1_sum))

                    catalog_json[sys_id].append({
                        "id": rom_id,
                        "titulo": title,
                        "archivo": rel_path,
                        "nombreArchivo": item.name,
                        "caratula": cover_url,
                        "cartucho": cart_url,
                        "genero": genre,
                        "year": year,
                        "core": meta["core_name"],
                        "fileSize": file_size,
                        "sha1": sha1_sum,
                        "isPlayable": True
                    })
                    found_count += 1

    conn.commit()

    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog_json, f, indent=2, ensure_ascii=False)

    print(f"[OK] Escaneo completado: {found_count} ROMs reales encontradas y sincronizadas.")
    print(f"[OK] Base de datos SQLite: {DB_PATH}")
    print(f"[OK] Catálogo JSON: {CATALOG_PATH}")

if __name__ == '__main__':
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)
    scan_roms(conn)
    conn.close()
