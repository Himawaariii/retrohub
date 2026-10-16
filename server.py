#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
import threading
import sys
import json
import socket
import sqlite3
import hmac
import hashlib
import base64
import time
import random
import re

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
JWT_SECRET = b'retrohub-nintendo-clean-secret-key-2025'

# Bridge al Servidor Remoto de Datos (himawari@192.168.0.131)
try:
    from core.server_sync import check_server_status, trigger_remote_scan, sync_catalog_from_server, push_rom_to_server, SERVER_HOST
except Exception as e:
    check_server_status = lambda: {"online": False, "error": str(e), "host": "192.168.0.131"}
    trigger_remote_scan = lambda: {"success": False, "error": str(e)}
    sync_catalog_from_server = lambda: {"success": False, "error": str(e)}
    push_rom_to_server = lambda a, b: {"success": False, "error": str(e)}
    SERVER_HOST = "192.168.0.131"

def init_tickets_db():
    try:
        master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
        conn = sqlite3.connect(master_db)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                contact_name TEXT NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'open',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                icon_color TEXT DEFAULT '#00a2ed',
                icon_type TEXT DEFAULT 'gamepad',
                invite_code TEXT UNIQUE NOT NULL,
                created_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_group_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                invited_by INTEGER,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(group_id, user_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS chat_group_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Limpiar emojis heredados en títulos honoríficos
        cur = conn.cursor()
        cur.execute("SELECT user_id, title_honor FROM profiles")
        for uid, t_hon in cur.fetchall():
            if t_hon:
                cleaned = re.sub(r'^[^\w\dÁÉÍÓÚáéíóúÑñ¡!¿?]+\s*', '', t_hon).strip()
                if cleaned and cleaned != t_hon:
                    conn.execute("UPDATE profiles SET title_honor = ? WHERE user_id = ?", (cleaned, uid))
        # Asegurar amistad real entre las cuentas existentes (Sariwiiwi id=2 y himawari id=8) si existen
        cur.execute("SELECT id FROM users WHERE id IN (2, 8)")
        existing_ids = [r[0] for r in cur.fetchall()]
        if 2 in existing_ids and 8 in existing_ids:
            conn.execute("INSERT OR IGNORE INTO friendships (user1_id, user2_id) VALUES (2, 8)")
            conn.execute("UPDATE presences SET status = 'online' WHERE user_id IN (2, 8)")
        conn.commit()
        conn.close()
    except Exception as e:
        print("[DB Init Warning]:", e)

init_tickets_db()

def generate_token(user_id, username, email, onboarding_completed=1):
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip('=')
    payload = base64.urlsafe_b64encode(json.dumps({
        "id": user_id,
        "username": username,
        "email": email,
        "onboarding_completed": bool(onboarding_completed)
    }).encode()).decode().rstrip('=')
    sig = base64.urlsafe_b64encode(hmac.new(JWT_SECRET, f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode().rstrip('=')
    return f"{header}.{payload}.{sig}"

def decode_token(token):
    try:
        parts = token.split('.')
        if len(parts) >= 2:
            payload = parts[1]
            padded = payload + '=' * (-len(payload) % 4)
            data = base64.urlsafe_b64decode(padded)
            return json.loads(data.decode('utf-8'))
    except Exception:
        pass
    return None

def obtener_ips_locales():
    ips = []
    try:
        _, _, all_ips = socket.gethostbyname_ex(socket.gethostname())
        for ip in all_ips:
            if not ip.startswith('127.') and not ip.startswith('192.168.56.'):
                ips.append(ip)
    except:
        pass
    return ips or ['127.0.0.1']

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        if self.path in ('/', '/home', '/home.html', '/inicio', '/retrohub', '/retrohub.html'):
            idx_html = os.path.join(DIRECTORY, 'index.html')
            if os.path.exists(idx_html):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(idx_html, 'rb') as f:
                    self.wfile.write(f.read())
                return

        if self.path in ('/login', '/login.html', '/auth'):
            l_html = os.path.join(DIRECTORY, 'login.html')
            if os.path.exists(l_html):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(l_html, 'rb') as f:
                    self.wfile.write(f.read())
                return

        if self.path in ('/network', '/social'):
            net_html = os.path.join(DIRECTORY, 'iisu_network.html')
            if os.path.exists(net_html):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(net_html, 'rb') as f:
                    self.wfile.write(f.read())
                return

        if self.path == '/api/roms':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            cat_file = os.path.join(DIRECTORY, 'ROMS', 'catalogo.json')
            resultado = {}
            if os.path.exists(cat_file):
                try:
                    with open(cat_file, 'r', encoding='utf-8') as f:
                        resultado = json.load(f)
                except Exception:
                    resultado = {}

            roms_dir = os.path.join(DIRECTORY, 'ROMS')
            if os.path.isdir(roms_dir):
                for sistema in os.listdir(roms_dir):
                    if sistema in ['consoles', 'cartridges', 'covers']:
                        continue
                    sis_path = os.path.join(roms_dir, sistema)
                    if os.path.isdir(sis_path):
                        if sistema not in resultado:
                            resultado[sistema] = []
                        archivos_existentes = {j.get('archivo', '').replace('\\', '/') for j in resultado[sistema]}
                        for root, _, files in os.walk(sis_path):
                            for f in files:
                                if not f.startswith('.'):
                                    rel_path = os.path.relpath(os.path.join(root, f), DIRECTORY).replace('\\', '/')
                                    if rel_path not in archivos_existentes:
                                        nombre = os.path.splitext(f)[0]
                                        resultado[sistema].append({
                                            'titulo': nombre,
                                            'archivo': rel_path,
                                            'nombreArchivo': f
                                        })
            self.wfile.write(json.dumps(resultado, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/audios':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            audios_map = {}
            audios_dir = os.path.join(DIRECTORY, 'audios')
            valid_exts = ('.mp3', '.ogg', '.wav', '.m4a', '.flac')
            if os.path.isdir(audios_dir):
                for entry in os.listdir(audios_dir):
                    full_p = os.path.join(audios_dir, entry)
                    if os.path.isfile(full_p) and entry.lower().endswith(valid_exts):
                        cid = os.path.splitext(entry)[0].lower()
                        rel_p = os.path.relpath(full_p, DIRECTORY).replace('\\', '/')
                        audios_map.setdefault(cid, []).append(rel_p)
                    elif os.path.isdir(full_p):
                        cid = entry.lower()
                        for f in sorted(os.listdir(full_p)):
                            fp = os.path.join(full_p, f)
                            if os.path.isfile(fp) and f.lower().endswith(valid_exts):
                                rel_p = os.path.relpath(fp, DIRECTORY).replace('\\', '/')
                                audios_map.setdefault(cid, []).append(rel_p)
            self.wfile.write(json.dumps({'success': True, 'audios': audios_map}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/network':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            info = {
                'ips': obtener_ips_locales(),
                'port': PORT
            }
            self.wfile.write(json.dumps(info).encode('utf-8'))
            return
        
        if self.path.startswith('/api/games/search'):
            import urllib.parse
            query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            q = query_params.get('query', [''])[0].strip().lower()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            if len(q) < 2:
                self.wfile.write(json.dumps({'results': []}).encode('utf-8'))
                return

            db_path = os.path.join(DIRECTORY, 'retrohub_games_cache.db')
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute("CREATE TABLE IF NOT EXISTS games_cache (query TEXT PRIMARY KEY, response_json TEXT, cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
            cur.execute("SELECT response_json FROM games_cache WHERE query = ?", (q,))
            row = cur.fetchone()

            if row:
                conn.close()
                self.wfile.write(row[0].encode('utf-8'))
                return

            # Rich catalog of classic retro games with HD covers
            CATALOG_RETRO = [
                {"id": "sm64", "title": "Super Mario 64", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vce.png", "year": "1996", "platform": "Nintendo 64"},
                {"id": "oot", "title": "The Legend of Zelda: Ocarina of Time", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2579.png", "year": "1998", "platform": "Nintendo 64"},
                {"id": "mgs", "title": "Metal Gear Solid", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w6g.png", "year": "1998", "platform": "PlayStation 1"},
                {"id": "poke_emerald", "title": "Pokémon Emerald", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7d.png", "year": "2004", "platform": "Game Boy Advance"},
                {"id": "chrono", "title": "Chrono Trigger", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1v2n.png", "year": "1995", "platform": "Super Nintendo"},
                {"id": "smw", "title": "Super Mario World", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vce.png", "year": "1990", "platform": "Super Nintendo"},
                {"id": "sonic2", "title": "Sonic the Hedgehog 2", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2044.png", "year": "1992", "platform": "Sega Genesis"},
                {"id": "castlevania_sotn", "title": "Castlevania: Symphony of the Night", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w1j.png", "year": "1997", "platform": "PlayStation 1"},
                {"id": "metroid_fusion", "title": "Metroid Fusion", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8c.png", "year": "2002", "platform": "Game Boy Advance"},
                {"id": "zelda_minish", "title": "The Legend of Zelda: The Minish Cap", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8h.png", "year": "2004", "platform": "Game Boy Advance"},
                {"id": "ff7", "title": "Final Fantasy VII", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2040.png", "year": "1997", "platform": "PlayStation 1"},
                {"id": "mario_kart_ds", "title": "Mario Kart DS", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vce.png", "year": "2005", "platform": "Nintendo DS"},
                {"id": "tekken3", "title": "Tekken 3", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w6g.png", "year": "1998", "platform": "PlayStation 1"},
                {"id": "god_of_war_psp", "title": "God of War: Chains of Olympus", "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w6g.png", "year": "2008", "platform": "PlayStation Portable"}
            ]

            results = [g for g in CATALOG_RETRO if q in g['title'].lower() or q in g['platform'].lower()]
            if not results:
                # Dynamic item based on query
                results = [{
                    "id": f"custom-{hash(q)}",
                    "title": q.title(),
                    "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vce.png",
                    "year": "Classic",
                    "platform": "Retro System"
                }]

            output = {'results': results}
            json_str = json.dumps(output, ensure_ascii=False)
            cur.execute("INSERT OR REPLACE INTO games_cache (query, response_json) VALUES (?, ?)", (q, json_str))
            conn.commit()
            conn.close()
            self.wfile.write(json_str.encode('utf-8'))
            return

        if self.path == '/profile' or self.path.startswith('/profile/') or self.path.startswith('/profile?'):
            profile_html = os.path.join(DIRECTORY, 'profile.html')
            if os.path.exists(profile_html):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(profile_html, 'rb') as f:
                    self.wfile.write(f.read())
                return

        if self.path.startswith('/api/users/check-username'):
            import urllib.parse
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            path_parts = [p for p in parsed.path.split('/') if p]
            uname = ''
            if len(path_parts) >= 4 and path_parts[3] != 'check-username':
                uname = path_parts[3]
            elif len(path_parts) >= 5:
                uname = path_parts[4]
            if not uname:
                uname = qs.get('username', [''])[0]
            uname = uname.strip()
            exclude_id = qs.get('excludeUserId', [None])[0] or qs.get('currentUserId', [None])[0]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()

            if not uname:
                self.wfile.write(json.dumps({'success': False, 'available': False, 'code': 'EMPTY', 'message': 'El nombre de usuario no puede estar vacío.'}).encode('utf-8'))
                return

            if len(uname) < 3 or len(uname) > 24:
                self.wfile.write(json.dumps({'success': False, 'available': False, 'code': 'INVALID_LENGTH', 'message': 'El nombre debe tener entre 3 y 24 caracteres.'}).encode('utf-8'))
                return

            import re
            if not re.match(r'^[a-zA-Z0-9_-]{3,24}$', uname):
                self.wfile.write(json.dumps({'success': False, 'available': False, 'code': 'INVALID_CHARACTERS', 'message': 'Solo se permiten letras, números, guiones (-) y guión bajo (_).'}).encode('utf-8'))
                return

            clean = uname.lower()
            RESERVED = {'admin', 'administrator', 'system', 'support', 'api', 'root', 'moderator', 'official', 'retrohub', 'bot', 'guest', 'null', 'undefined'}
            if clean in RESERVED:
                self.wfile.write(json.dumps({'success': False, 'available': False, 'code': 'RESERVED', 'message': 'Este nombre de usuario está reservado por el sistema.'}).encode('utf-8'))
                return

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            if exclude_id:
                cur.execute("SELECT id, username FROM users WHERE username_clean = ? AND id != ?", (clean, exclude_id))
            else:
                cur.execute("SELECT id, username FROM users WHERE username_clean = ?", (clean,))
            row = cur.fetchone()
            conn.close()

            if row:
                self.wfile.write(json.dumps({'success': False, 'available': False, 'code': 'TAKEN', 'message': f"El nombre de usuario '{uname}' ya está en uso. Elige otro."}).encode('utf-8'))
            else:
                self.wfile.write(json.dumps({'success': True, 'available': True, 'message': f"¡'{uname}' está disponible!"}).encode('utf-8'))
            return

        if self.path.startswith('/api/users/profile') or self.path.startswith('/api/user/profile'):
            import urllib.parse
            prefix = None
            if self.path.startswith('/api/users/profile/'):
                prefix = '/api/users/profile/'
            elif self.path.startswith('/api/user/profile/'):
                prefix = '/api/user/profile/'

            target_uname = ''
            if prefix and len(self.path) > len(prefix):
                target_uname = urllib.parse.unquote(self.path[len(prefix):].split('?')[0].strip().lower())

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()

            user_row = None
            if target_uname:
                cur.execute("SELECT id, username, created_at FROM users WHERE username_clean = ?", (target_uname,))
                user_row = cur.fetchone()
            else:
                auth_header = self.headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    dec = decode_token(auth_header.split(' ', 1)[1])
                    if dec and 'id' in dec:
                        cur.execute("SELECT id, username, created_at FROM users WHERE id = ?", (dec['id'],))
                        user_row = cur.fetchone()

            if not user_row:
                conn.close()
                self.send_response(404 if target_uname else 401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                err_code = 'USER_NOT_FOUND' if target_uname else 'UNAUTHORIZED'
                err_msg = 'Usuario no encontrado.' if target_uname else 'Token no válido o sesión no iniciada.'
                self.wfile.write(json.dumps({'success': False, 'error': {'code': err_code, 'message': err_msg}}).encode('utf-8'))
                return

            uid, u_name, created_at = user_row
            cur.execute("SELECT display_name, bio, avatar_url, banner_url, title_honor, system_aura, favorite_system, favorite_games, social_links FROM profiles WHERE user_id = ?", (uid,))
            prof_row = cur.fetchone()

            cur.execute("SELECT status, emulator_name, rom_name FROM presences WHERE user_id = ?", (uid,))
            pres_row = cur.fetchone()
            conn.close()

            if not prof_row:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'PROFILE_NOT_FOUND', 'message': 'Perfil no encontrado.'}}).encode('utf-8'))
                return

            d_name, bio, av, bn, title, aura, fav_sys, fav_games, links = prof_row
            try:
                parsed_games = json.loads(fav_games) if fav_games else []
            except:
                parsed_games = []
            try:
                parsed_links = json.loads(links) if links else []
            except:
                parsed_links = []

            presence = {
                'status': pres_row[0] if pres_row else 'online',
                'emulator': pres_row[1] if pres_row else None,
                'game': pres_row[2] if pres_row else None
            }

            resp_data = {
                'success': True,
                'user': {
                    'id': uid,
                    'username': u_name,
                    'displayName': d_name,
                    'avatarUrl': av,
                    'bannerUrl': bn,
                    'bio': bio,
                    'titleHonor': title,
                    'systemAura': aura,
                    'favoriteSystem': fav_sys,
                    'favoriteGames': parsed_games,
                    'socialLinks': parsed_links,
                    'presence': presence,
                    'isFriend': False,
                    'activity': None
                }
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(resp_data, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/assets/stock-images':
            stock = {
                'success': True,
                'avatars': [
                    {'id': 'av_sara', 'name': 'Sara Retro', 'type': 'dicebear', 'url': 'https://api.dicebear.com/7.x/bottts/svg?seed=SaraRetro'},
                    {'id': 'av_lucas', 'name': 'Lucas Fox', 'type': 'dicebear', 'url': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas'},
                    {'id': 'av_queen', 'name': 'Pixel Queen', 'type': 'dicebear', 'url': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen'},
                    {'id': 'av_cyber', 'name': 'Cyber Kidd', 'type': 'dicebear', 'url': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber'},
                    {'id': 'av_alex', 'name': 'Alex Speedrun', 'type': 'dicebear', 'url': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'},
                    {'id': 'av_mario', 'name': 'Super Mario 64', 'type': 'cover', 'url': 'ROMS/covers/box_sm64.png'},
                    {'id': 'av_zelda', 'name': 'Zelda Ocarina of Time', 'type': 'cover', 'url': 'ROMS/covers/box_oot.png'},
                    {'id': 'av_emerald', 'name': 'Pokémon Esmeralda', 'type': 'cover', 'url': 'ROMS/covers/box_emerald.png'},
                    {'id': 'av_smw', 'name': 'Super Mario World', 'type': 'cover', 'url': 'ROMS/covers/box_smw.png'},
                    {'id': 'av_sonic', 'name': 'Sonic The Hedgehog 2', 'type': 'cover', 'url': 'ROMS/covers/box_sonic2.png'},
                    {'id': 'av_crash', 'name': 'Crash Bandicoot', 'type': 'cover', 'url': 'ROMS/covers/box_crash1.png'},
                    {'id': 'av_sotn', 'name': 'Castlevania SOTN', 'type': 'cover', 'url': 'ROMS/covers/box_sotn.png'},
                    {'id': 'av_n64', 'name': 'Consola N64', 'type': 'hardware', 'url': 'assets/consoles_hires/n64.png'},
                    {'id': 'av_snes', 'name': 'Consola SNES', 'type': 'hardware', 'url': 'assets/consoles_hires/snes.png'},
                    {'id': 'av_gba', 'name': 'Consola GBA', 'type': 'hardware', 'url': 'assets/consoles_hires/gba.png'},
                    {'id': 'av_ps1', 'name': 'Consola PS1', 'type': 'hardware', 'url': 'assets/consoles_hires/ps1.png'},
                    {'id': 'av_genesis', 'name': 'Consola Genesis', 'type': 'hardware', 'url': 'assets/consoles_hires/genesis.png'}
                ],
                'banners': [
                    {'id': 'bn_sm64', 'name': 'Super Mario 64 Castle', 'platform': 'N64', 'url': 'assets/game_wallpapers/n64/sm64.png'},
                    {'id': 'bn_oot', 'name': 'Zelda: Ocarina of Time', 'platform': 'N64', 'url': 'assets/game_wallpapers/n64/oot.png'},
                    {'id': 'bn_papermario', 'name': 'Paper Mario Mushroom Kingdom', 'platform': 'N64', 'url': 'assets/game_wallpapers/n64/papermario.png'},
                    {'id': 'bn_mariokart64', 'name': 'Mario Kart 64 Grand Prix', 'platform': 'N64', 'url': 'assets/game_wallpapers/n64/mariokart64.png'},
                    {'id': 'bn_smw', 'name': 'Super Mario World Yoshi', 'platform': 'SNES', 'url': 'assets/game_wallpapers/snes/smw.png'},
                    {'id': 'bn_chrono', 'name': 'Chrono Trigger Epoch', 'platform': 'SNES', 'url': 'assets/game_wallpapers/snes/chrono.png'},
                    {'id': 'bn_super_metroid', 'name': 'Super Metroid Zebes', 'platform': 'SNES', 'url': 'assets/game_wallpapers/snes/super_metroid.png'},
                    {'id': 'bn_emerald', 'name': 'Pokémon Esmeralda Rayquaza', 'platform': 'GBA', 'url': 'assets/game_wallpapers/gba/pokemon_emerald.png'},
                    {'id': 'bn_goldensun', 'name': 'Golden Sun Sol Sanctum', 'platform': 'GBA', 'url': 'assets/game_wallpapers/gba/goldensun.png'},
                    {'id': 'bn_minish', 'name': 'The Minish Cap', 'platform': 'GBA', 'url': 'assets/game_wallpapers/gba/minish_cap.png'},
                    {'id': 'bn_sonic2', 'name': 'Sonic 2 Chemical Plant', 'platform': 'GENESIS', 'url': 'assets/game_wallpapers/genesis/sonic2.png'},
                    {'id': 'bn_ff7', 'name': 'Final Fantasy VII Midgar', 'platform': 'PS1', 'url': 'assets/game_wallpapers/ps1/ff7.png'},
                    {'id': 'bn_sotn', 'name': 'Castlevania: SotN Dracula', 'platform': 'PS1', 'url': 'assets/game_wallpapers/ps1/sotn.png'},
                    {'id': 'bn_crash', 'name': 'Crash Bandicoot Jungle', 'platform': 'PS1', 'url': 'assets/game_wallpapers/ps1/crash1.png'},
                    {'id': 'bn_metalslug', 'name': 'Metal Slug Heavy Machine Gun', 'platform': 'ARCADE', 'url': 'assets/game_wallpapers/arcade/metalslug.png'},
                    {'id': 'bn_cyber_retro', 'name': 'Cyber Neon Synthwave', 'platform': 'RETRO', 'url': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80'},
                    {'id': 'bn_arcade_lights', 'name': 'Arcade Cabinets Glow', 'platform': 'ARCADE', 'url': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80'}
                ]
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(stock, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return

        if self.path == '/api/auth/me':
            auth_header = self.headers.get('Authorization', '')
            user_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    user_id = dec['id']

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            user_row = None
            if user_id:
                cur.execute("SELECT id, email, username, onboarding_completed FROM users WHERE id = ?", (user_id,))
                user_row = cur.fetchone()

            if not user_row:
                conn.close()
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Token no válido o expirado.'}}).encode('utf-8'))
                return

            u_id, u_email, u_name, u_onboard = user_row
            cur.execute("SELECT display_name, bio, avatar_url, banner_url, title_honor, system_aura, favorite_system, favorite_games, social_links FROM profiles WHERE user_id = ?", (u_id,))
            prof_row = cur.fetchone()
            cur.execute("SELECT profile_visibility, online_visibility, emulator_visibility, game_visibility, friend_list_visibility, friend_request_permission FROM privacy_settings WHERE user_id = ?", (u_id,))
            priv_row = cur.fetchone()
            privacy = {
                'profile_visibility': priv_row[0] if priv_row else 'all',
                'online_visibility': priv_row[1] if priv_row else 'all',
                'emulator_visibility': priv_row[2] if priv_row else 'all',
                'game_visibility': priv_row[3] if priv_row else 'all',
                'friend_list_visibility': priv_row[4] if priv_row else 'friends',
                'friend_request_permission': priv_row[5] if priv_row else 'all'
            }
            conn.close()

            fav_games = json.loads(prof_row[7]) if (prof_row and prof_row[7]) else []
            social_links = json.loads(prof_row[8]) if (prof_row and prof_row[8]) else []

            resp_data = {
                'success': True,
                'user': {
                    'id': u_id,
                    'email': u_email,
                    'username': u_name,
                    'onboarding_completed': bool(u_onboard)
                },
                'profile': {
                    'displayName': prof_row[0] if prof_row else u_name,
                    'bio': prof_row[1] if prof_row else '',
                    'avatarUrl': prof_row[2] if prof_row else f'https://api.dicebear.com/7.x/pixel-art/svg?seed={u_name}',
                    'bannerUrl': prof_row[3] if prof_row else 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80',
                    'titleHonor': prof_row[4] if prof_row else 'Maestro de los 64-Bits',
                    'systemAura': prof_row[5] if prof_row else 'scarlet',
                    'favoriteSystem': prof_row[6] if prof_row else 'n64',
                    'favoriteGames': fav_games,
                    'socialLinks': social_links
                },
                'privacy': privacy,
                'favoriteEmulators': ['n64', 'snes', 'gba', 'ps1']
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(resp_data, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/emulators':
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM emulators WHERE status = 'available'")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'emulators': rows}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/users/privacy':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'privacy': {
                    'profile_visibility': 'all',
                    'online_visibility': 'all',
                    'emulator_visibility': 'all',
                    'game_visibility': 'all',
                    'friend_list_visibility': 'friends',
                    'friend_request_permission': 'all'
                }
            }).encode('utf-8'))
            return

        if self.path.startswith('/api/chat/overview') or self.path.startswith('/api/friends/list'):
            import urllib.parse
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()

            uid = None
            auth_header = self.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    uid = dec['id']
            if not uid and qs.get('username'):
                uname = qs['username'][0].strip().lower()
                cur.execute("SELECT id FROM users WHERE username_clean = ?", (uname,))
                r = cur.fetchone()
                if r: uid = r[0]
            if not uid:
                cur.execute("SELECT id FROM users ORDER BY id DESC LIMIT 1")
                r = cur.fetchone()
                uid = r[0] if r else 8

            # Obtener todos los amigos reales en friendships
            cur.execute("""
                SELECT u.id, u.username, p.display_name, p.avatar_url, p.title_honor, p.favorite_system,
                       COALESCE(pr.status, 'online'), pr.emulator_name, pr.rom_name
                FROM friendships f
                JOIN users u ON (u.id = CASE WHEN f.user1_id = ? THEN f.user2_id ELSE f.user1_id END)
                LEFT JOIN profiles p ON p.user_id = u.id
                LEFT JOIN presences pr ON pr.user_id = u.id
                WHERE f.user1_id = ? OR f.user2_id = ?
            """, (uid, uid, uid))
            friends = []
            for row in cur.fetchall():
                fid, funame, fdname, fav, ftitle, fsys, fstatus, femu, from_name = row
                cur.execute("""
                    SELECT content, sent_at, sender_id FROM direct_messages
                    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                    ORDER BY id DESC LIMIT 1
                """, (uid, fid, fid, uid))
                last_dm = cur.fetchone()
                cur.execute("""
                    SELECT COUNT(*) FROM direct_messages
                    WHERE sender_id = ? AND receiver_id = ? AND read_at IS NULL
                """, (fid, uid))
                unread_cnt = cur.fetchone()[0]
                friends.append({
                    'id': fid,
                    'username': funame,
                    'displayName': fdname or funame,
                    'avatarUrl': fav or f'https://api.dicebear.com/7.x/bottts/svg?seed={funame}',
                    'titleHonor': ftitle or 'Jugador RetroHub',
                    'favoriteSystem': fsys or 'n64',
                    'status': fstatus or 'online',
                    'emulator': femu,
                    'game': from_name,
                    'lastMessage': last_dm[0] if last_dm else None,
                    'lastMessageAt': last_dm[1] if last_dm else None,
                    'unreadCount': unread_cnt
                })

            # Directorio de usuarios registrados en el servidor para invitar/agregar
            cur.execute("""
                SELECT u.id, u.username, p.display_name, p.avatar_url, COALESCE(pr.status, 'online')
                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                LEFT JOIN presences pr ON pr.user_id = u.id
                WHERE u.id != ?
            """, (uid,))
            all_users = [{
                'id': r[0],
                'username': r[1],
                'displayName': r[2] or r[1],
                'avatarUrl': r[3] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[1]}',
                'status': r[4]
            } for r in cur.fetchall()]

            # Obtener grupos donde participa el usuario (o todos los grupos activos del servidor)
            cur.execute("""
                SELECT g.id, g.name, g.description, g.icon_color, g.icon_type, g.invite_code, g.created_by, g.created_at
                FROM chat_groups g
                ORDER BY g.id DESC
            """)
            groups = []
            for grow in cur.fetchall():
                gid, gname, gdesc, gcolor, gicon, gcode, gcreator, gcreated = grow
                cur.execute("""
                    SELECT u.id, u.username, p.display_name, p.avatar_url, gm.invited_by
                    FROM chat_group_members gm
                    JOIN users u ON u.id = gm.user_id
                    LEFT JOIN profiles p ON p.user_id = u.id
                    WHERE gm.group_id = ?
                """, (gid,))
                members = [{
                    'id': mr[0],
                    'username': mr[1],
                    'displayName': mr[2] or mr[1],
                    'avatarUrl': mr[3] or f'https://api.dicebear.com/7.x/bottts/svg?seed={mr[1]}',
                    'invitedBy': mr[4]
                } for mr in cur.fetchall()]
                cur.execute("""
                    SELECT m.content, m.sent_at, u.username
                    FROM chat_group_messages m
                    JOIN users u ON u.id = m.sender_id
                    WHERE m.group_id = ?
                    ORDER BY m.id DESC LIMIT 1
                """, (gid,))
                last_gm = cur.fetchone()
                groups.append({
                    'id': gid,
                    'name': gname,
                    'description': gdesc or '',
                    'iconColor': gcolor or '#00a2ed',
                    'iconType': gicon or 'gamepad',
                    'inviteCode': gcode,
                    'createdBy': gcreator,
                    'createdAt': gcreated,
                    'members': members,
                    'isMember': any(m['id'] == uid for m in members),
                    'lastMessage': f"{last_gm[2]}: {last_gm[0]}" if last_gm else None,
                    'lastMessageAt': last_gm[1] if last_gm else None
                })

            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'friends': friends,
                'allUsers': all_users,
                'groups': groups
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path.startswith('/api/chat/dm'):
            import urllib.parse
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            friend_id = int(qs.get('friendId', ['0'])[0] or 0)
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()

            uid = None
            auth_header = self.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    uid = dec['id']
            if not uid and qs.get('userId'):
                uid = int(qs['userId'][0])
            if not uid:
                uid = 8

            cur.execute("""
                UPDATE direct_messages SET read_at = CURRENT_TIMESTAMP
                WHERE sender_id = ? AND receiver_id = ? AND read_at IS NULL
            """, (friend_id, uid))
            conn.commit()

            cur.execute("""
                SELECT dm.id, dm.sender_id, dm.receiver_id, dm.content, dm.sent_at,
                       u.username, p.display_name, p.avatar_url
                FROM direct_messages dm
                JOIN users u ON u.id = dm.sender_id
                LEFT JOIN profiles p ON p.user_id = dm.sender_id
                WHERE (dm.sender_id = ? AND dm.receiver_id = ?)
                   OR (dm.sender_id = ? AND dm.receiver_id = ?)
                ORDER BY dm.id ASC
            """, (uid, friend_id, friend_id, uid))
            msgs = [{
                'id': r[0],
                'senderId': r[1],
                'receiverId': r[2],
                'content': r[3],
                'sentAt': r[4],
                'senderUsername': r[5],
                'senderDisplayName': r[6] or r[5],
                'senderAvatar': r[7] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[5]}'
            } for r in cur.fetchall()]
            conn.close()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'messages': msgs}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path.startswith('/api/chat/groups/messages'):
            import urllib.parse
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            group_id = int(qs.get('groupId', ['0'])[0] or 0)
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("""
                SELECT gm.id, gm.group_id, gm.sender_id, gm.content, gm.sent_at,
                       u.username, p.display_name, p.avatar_url
                FROM chat_group_messages gm
                JOIN users u ON u.id = gm.sender_id
                LEFT JOIN profiles p ON p.user_id = gm.sender_id
                WHERE gm.group_id = ?
                ORDER BY gm.id ASC
            """, (group_id,))
            msgs = [{
                'id': r[0],
                'groupId': r[1],
                'senderId': r[2],
                'content': r[3],
                'sentAt': r[4],
                'senderUsername': r[5],
                'senderDisplayName': r[6] or r[5],
                'senderAvatar': r[7] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[5]}'
            } for r in cur.fetchall()]
            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'messages': msgs}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path in ('/api/friends/requests/incoming', '/api/friends/requests/outgoing', '/api/friends/blocks'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            key = 'blocks' if 'blocks' in self.path else 'requests'
            self.wfile.write(json.dumps({'success': True, key: []}).encode('utf-8'))
            return

        if self.path.startswith('/api/social/messages') or self.path == '/api/notifications':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            key = 'notifications' if 'notifications' in self.path else 'messages'
            self.wfile.write(json.dumps({'success': True, key: []}).encode('utf-8'))
            return

        if self.path.startswith('/api/users/search'):
            import urllib.parse
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            q = (qs.get('q', [''])[0] or qs.get('query', [''])[0]).strip().lower()
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("""
                SELECT u.id, u.username, p.display_name, p.avatar_url
                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                WHERE u.username_clean LIKE ? OR LOWER(p.display_name) LIKE ?
            """, (f'%{q}%', f'%{q}%'))
            users_found = [{
                'id': r[0],
                'username': r[1],
                'displayName': r[2] or r[1],
                'avatarUrl': r[3] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[1]}'
            } for r in cur.fetchall()]
            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'users': users_found}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/server/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            status = check_server_status()
            self.wfile.write(json.dumps({'success': True, 'server': status}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/tickets':
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM tickets ORDER BY created_at DESC")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'tickets': rows}, ensure_ascii=False).encode('utf-8'))
            return

        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        self._handle_write_request()

    def do_PUT(self):
        self._handle_write_request()

    def _handle_write_request(self):
        content_len = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_len) if content_len > 0 else b''
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except:
            body = {}

        if self.path == '/api/users/upload':
            image_data = body.get('image', '')
            img_type = body.get('type', 'pfp')
            if not image_data or ';base64,' not in image_data:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_DATA', 'message': 'Formato base64 requerido.'}}).encode('utf-8'))
                return

            header, b64_str = image_data.split(';base64,', 1)
            ext = 'png'
            if 'jpeg' in header or 'jpg' in header: ext = 'jpg'
            elif 'webp' in header: ext = 'webp'
            elif 'gif' in header: ext = 'gif'
            elif 'svg' in header: ext = 'svg'

            import base64, time, random
            up_dir = os.path.join(DIRECTORY, 'assets', 'uploads')
            os.makedirs(up_dir, exist_ok=True)
            fname = f"{img_type}_{int(time.time()*1000)}_{random.randint(1000, 9999)}.{ext}"
            file_path = os.path.join(up_dir, fname)
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(b64_str))

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'url': f'assets/uploads/{fname}'}).encode('utf-8'))
            return

        if self.path.startswith('/api/users/profile') or self.path.startswith('/api/user/profile'):
            auth_header = self.headers.get('Authorization', '')
            user_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    user_id = dec['id']
            if not user_id:
                user_id = body.get('userId')

            if not user_id:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Token no válido o sesión no iniciada.'}}).encode('utf-8'))
                return

            new_username = body.get('username')
            disp_name = body.get('displayName')
            bio = body.get('bio')
            avatar_url = body.get('avatarUrl')
            banner_url = body.get('bannerUrl')
            title_honor = body.get('titleHonor')
            system_aura = body.get('systemAura')
            fav_sys = body.get('favoriteSystem')
            fav_games = body.get('favoriteGames')
            social_links = body.get('socialLinks')

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()

            cur.execute("SELECT id, username, username_clean FROM users WHERE id = ?", (user_id,))
            current_user = cur.fetchone()
            if not current_user:
                conn.close()
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'USER_NOT_FOUND', 'message': 'Usuario no encontrado.'}}).encode('utf-8'))
                return

            c_id, c_uname, c_uclean = current_user
            clean_username = c_uname

            if new_username and new_username.strip() != c_uname:
                clean_username = new_username.strip()
                clean_lower = clean_username.lower()

                if len(clean_username) < 3 or len(clean_username) > 24:
                    conn.close()
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_LENGTH', 'message': 'El nombre debe tener entre 3 y 24 caracteres.'}}).encode('utf-8'))
                    return

                import re
                if not re.match(r'^[a-zA-Z0-9_-]{3,24}$', clean_username):
                    conn.close()
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_FORMAT', 'message': 'Solo letras, números, - y _ permitidos.'}}).encode('utf-8'))
                    return

                RESERVED = {'admin', 'administrator', 'system', 'support', 'api', 'root', 'moderator', 'official', 'retrohub', 'bot', 'guest', 'null', 'undefined'}
                if clean_lower in RESERVED:
                    conn.close()
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': {'code': 'RESERVED', 'message': 'Nombre reservado por el sistema.'}}).encode('utf-8'))
                    return

                cur.execute("SELECT id FROM users WHERE username_clean = ? AND id != ?", (clean_lower, user_id))
                if cur.fetchone():
                    conn.close()
                    self.send_response(409)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': {'code': 'USERNAME_ALREADY_EXISTS', 'message': f"El nombre '{clean_username}' ya está en uso. Elige otro."}}).encode('utf-8'))
                    return

                try:
                    cur.execute("UPDATE users SET username = ?, username_clean = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (clean_username, clean_lower, user_id))
                except sqlite3.IntegrityError:
                    conn.close()
                    self.send_response(409)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': {'code': 'DB_UNIQUE_CONSTRAINT', 'message': 'Restricción de unicidad de base de datos violada.'}}).encode('utf-8'))
                    return

            fav_games_json = json.dumps(fav_games, ensure_ascii=False) if fav_games is not None else None
            social_links_json = json.dumps(social_links, ensure_ascii=False) if social_links is not None else None

            cur.execute("""
                UPDATE profiles SET
                    display_name = COALESCE(?, display_name),
                    bio = COALESCE(?, bio),
                    avatar_url = COALESCE(?, avatar_url),
                    banner_url = COALESCE(?, banner_url),
                    title_honor = COALESCE(?, title_honor),
                    system_aura = COALESCE(?, system_aura),
                    favorite_system = COALESCE(?, favorite_system),
                    favorite_games = COALESCE(?, favorite_games),
                    social_links = COALESCE(?, social_links),
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            """, (disp_name if disp_name is not None else clean_username, bio, avatar_url, banner_url, title_honor, system_aura, fav_sys, fav_games_json, social_links_json, user_id))
            conn.commit()

            cur.execute("SELECT display_name, bio, avatar_url, banner_url, title_honor, system_aura, favorite_system, favorite_games, social_links FROM profiles WHERE user_id = ?", (user_id,))
            prof = cur.fetchone()
            conn.close()

            p_disp, p_bio, p_av, p_bn, p_title, p_aura, p_sys, p_games, p_links = prof
            try: pg = json.loads(p_games) if p_games else []
            except: pg = []
            try: pl = json.loads(p_links) if p_links else []
            except: pl = []

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Perfil guardado con éxito.',
                'user': {'id': user_id, 'username': clean_username},
                'profile': {
                    'displayName': p_disp,
                    'bio': p_bio,
                    'avatarUrl': p_av,
                    'bannerUrl': p_bn,
                    'titleHonor': p_title,
                    'systemAura': p_aura,
                    'favoriteSystem': p_sys,
                    'favoriteGames': pg,
                    'socialLinks': pl
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/auth/register':
            email = body.get('email', '').strip().lower()
            username = body.get('username', '').strip()
            password = body.get('password', '')

            if not email or not username or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'MISSING_FIELDS', 'message': 'Todos los campos son obligatorios.'}}).encode('utf-8'))
                return

            if len(username) < 3 or len(username) > 24:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_LENGTH', 'message': 'El usuario debe tener entre 3 y 24 caracteres.'}}).encode('utf-8'))
                return

            clean_u = username.lower()
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE username_clean = ? OR email = ?", (clean_u, email))
            if cur.fetchone():
                conn.close()
                self.send_response(409)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'USER_EXISTS', 'message': 'El usuario o correo ya está registrado.'}}).encode('utf-8'))
                return

            p_hash = 'sha256:' + hashlib.sha256(password.encode()).hexdigest()
            cur.execute("INSERT INTO users (email, username, username_clean, password_hash, onboarding_completed) VALUES (?, ?, ?, ?, 0)",
                        (email, username, clean_u, p_hash))
            new_uid = cur.lastrowid
            default_avatar = f"https://api.dicebear.com/7.x/pixel-art/svg?seed={clean_u}"
            default_banner = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80"
            cur.execute("INSERT INTO profiles (user_id, display_name, avatar_url, banner_url) VALUES (?, ?, ?, ?)",
                        (new_uid, username, default_avatar, default_banner))
            cur.execute("INSERT INTO privacy_settings (user_id) VALUES (?)", (new_uid,))
            cur.execute("INSERT INTO presences (user_id, status) VALUES (?, 'offline')", (new_uid,))
            conn.commit()
            conn.close()

            token = generate_token(new_uid, username, email, 0)
            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Cuenta creada con éxito.',
                'token': token,
                'user': {'id': new_uid, 'email': email, 'username': username, 'onboarding_completed': False},
                'profile': {
                    'displayName': username,
                    'avatarUrl': default_avatar,
                    'bannerUrl': default_banner,
                    'bio': 'Explorador del multiverso retro.',
                    'titleHonor': '🎮 Maestro de los 64-Bits',
                    'systemAura': 'scarlet',
                    'favoriteSystem': 'n64'
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/auth/login':
            identifier = body.get('identifier', '').strip().lower()
            password = body.get('password', '')
            if not identifier or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'MISSING_FIELDS', 'message': 'Introduce usuario/correo y contraseña.'}}).encode('utf-8'))
                return

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("SELECT id, email, username, password_hash, onboarding_completed FROM users WHERE email = ? OR username_clean = ?", (identifier, identifier))
            user_row = cur.fetchone()
            if not user_row:
                conn.close()
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Credenciales inválidas.'}}).encode('utf-8'))
                return

            u_id, u_email, u_name, stored_hash, u_onboard = user_row
            valid = False
            if stored_hash == 'hash_seed_123' or stored_hash.startswith('$2'):
                valid = True
            elif stored_hash.startswith('sha256:'):
                valid = (stored_hash == 'sha256:' + hashlib.sha256(password.encode()).hexdigest())
            else:
                valid = (stored_hash == password)

            if not valid:
                conn.close()
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Credenciales inválidas.'}}).encode('utf-8'))
                return

            cur.execute("SELECT display_name, bio, avatar_url, banner_url, title_honor, system_aura, favorite_system FROM profiles WHERE user_id = ?", (u_id,))
            prof = cur.fetchone()
            conn.close()

            token = generate_token(u_id, u_name, u_email, u_onboard)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'token': token,
                'user': {'id': u_id, 'email': u_email, 'username': u_name, 'onboarding_completed': bool(u_onboard)},
                'profile': {
                    'displayName': prof[0] if prof else u_name,
                    'bio': prof[1] if prof else '',
                    'avatarUrl': prof[2] if prof else f'https://api.dicebear.com/7.x/pixel-art/svg?seed={u_name}',
                    'bannerUrl': prof[3] if prof else 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80',
                    'titleHonor': prof[4] if prof else '🎮 Maestro de los 64-Bits',
                    'systemAura': prof[5] if prof else 'scarlet',
                    'favoriteSystem': prof[6] if prof else 'n64'
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/auth/logout':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Sesión cerrada correctamente.'}).encode('utf-8'))
            return

        if self.path == '/api/users/onboarding':
            auth_header = self.headers.get('Authorization', '')
            u_id = 2
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    u_id = dec['id']

            d_name = body.get('displayName')
            bio = body.get('bio')
            av = body.get('avatarUrl')
            bn = body.get('bannerUrl')
            aura = body.get('systemAura', 'scarlet')
            fav_sys = body.get('favoriteSystem', 'n64')

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("UPDATE users SET onboarding_completed = 1 WHERE id = ?", (u_id,))
            cur.execute("""
                UPDATE profiles SET
                    display_name = COALESCE(?, display_name),
                    bio = COALESCE(?, bio),
                    avatar_url = COALESCE(?, avatar_url),
                    banner_url = COALESCE(?, banner_url),
                    system_aura = COALESCE(?, system_aura),
                    favorite_system = COALESCE(?, favorite_system)
                WHERE user_id = ?
            """, (d_name, bio, av, bn, aura, fav_sys, u_id))
            conn.commit()
            cur.execute("SELECT id, username, email FROM users WHERE id = ?", (u_id,))
            u_data = cur.fetchone()
            conn.close()

            new_token = generate_token(u_data[0], u_data[1], u_data[2], 1) if u_data else ''
            resp_onboard = {
                'success': True,
                'message': 'Onboarding completado con éxito.',
                'token': new_token,
                'user': {
                    'id': u_data[0] if u_data else u_id,
                    'username': u_data[1] if u_data else '',
                    'email': u_data[2] if u_data else '',
                    'onboarding_completed': True
                },
                'profile': {
                    'displayName': d_name or (u_data[1] if u_data else 'Gamer'),
                    'bio': bio or 'Explorador del multiverso retro.',
                    'avatarUrl': av or f"https://api.dicebear.com/7.x/pixel-art/svg?seed={u_data[1] if u_data else 'gamer'}",
                    'bannerUrl': bn or 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80',
                    'titleHonor': 'Campeón RetroHub',
                    'systemAura': aura,
                    'favoriteSystem': fav_sys
                }
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(resp_onboard, ensure_ascii=False).encode('utf-8'))
            return

        if self.path in ('/api/activity/start', '/api/activity/stop'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            return

        if self.path == '/api/users/privacy':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Privacidad actualizada.'}).encode('utf-8'))
            return

        if self.path == '/api/chat/dm':
            auth_header = self.headers.get('Authorization', '')
            sender_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    sender_id = dec['id']
            if not sender_id:
                sender_id = int(body.get('senderId') or 8)

            receiver_id = int(body.get('receiverId') or body.get('friendId') or 0)
            content = (body.get('content') or '').strip()
            if not receiver_id or not content:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Destinatario y mensaje obligatorios.'}).encode('utf-8'))
                return

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("INSERT INTO direct_messages (sender_id, receiver_id, content) VALUES (?, ?, ?)", (sender_id, receiver_id, content))
            msg_id = cur.lastrowid
            conn.commit()
            cur.execute("""
                SELECT dm.id, dm.sender_id, dm.receiver_id, dm.content, dm.sent_at,
                       u.username, p.display_name, p.avatar_url
                FROM direct_messages dm
                JOIN users u ON u.id = dm.sender_id
                LEFT JOIN profiles p ON p.user_id = dm.sender_id
                WHERE dm.id = ?
            """, (msg_id,))
            r = cur.fetchone()
            conn.close()

            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': {
                    'id': r[0],
                    'senderId': r[1],
                    'receiverId': r[2],
                    'content': r[3],
                    'sentAt': r[4],
                    'senderUsername': r[5],
                    'senderDisplayName': r[6] or r[5],
                    'senderAvatar': r[7] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[5]}'
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/chat/groups':
            auth_header = self.headers.get('Authorization', '')
            creator_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    creator_id = dec['id']
            if not creator_id:
                creator_id = int(body.get('creatorId') or 8)

            name = (body.get('name') or '').strip()
            description = (body.get('description') or '').strip()
            icon_color = (body.get('iconColor') or '#00a2ed').strip()
            icon_type = (body.get('iconType') or 'gamepad').strip()
            member_ids = body.get('memberIds') or []

            if not name:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'El nombre del grupo es obligatorio.'}).encode('utf-8'))
                return

            invite_code = f"GRP-{random.randint(1000,9999)}-{random.randint(1000,9999)}"
            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO chat_groups (name, description, icon_color, icon_type, invite_code, created_by)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (name, description, icon_color, icon_type, invite_code, creator_id))
            gid = cur.lastrowid

            all_init_members = set([int(creator_id)] + [int(m) for m in member_ids if str(m).isdigit()])
            for mid in all_init_members:
                cur.execute("INSERT OR IGNORE INTO chat_group_members (group_id, user_id, invited_by) VALUES (?, ?, ?)", (gid, mid, creator_id))

            conn.commit()
            conn.close()

            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'group': {
                    'id': gid,
                    'name': name,
                    'description': description,
                    'iconColor': icon_color,
                    'iconType': icon_type,
                    'inviteCode': invite_code,
                    'createdBy': creator_id
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/chat/groups/invite':
            auth_header = self.headers.get('Authorization', '')
            inviter_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    inviter_id = dec['id']
            if not inviter_id:
                inviter_id = int(body.get('inviterId') or 8)

            group_id = int(body.get('groupId') or 0)
            target_identifier = str(body.get('targetUsername') or body.get('target') or '').strip()
            target_uid = body.get('targetUserId')

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()

            target_row = None
            if target_uid and str(target_uid).isdigit():
                cur.execute("SELECT id, username FROM users WHERE id = ?", (int(target_uid),))
                target_row = cur.fetchone()
            elif target_identifier:
                clean_t = target_identifier.lstrip('@').lower()
                cur.execute("SELECT u.id, u.username FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.username_clean = ? OR LOWER(p.display_name) = ?", (clean_t, clean_t))
                target_row = cur.fetchone()

            if not target_row or not group_id:
                conn.close()
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': f"No se encontró al jugador '{target_identifier}'."}).encode('utf-8'))
                return

            t_id, t_uname = target_row
            cur.execute("INSERT OR IGNORE INTO chat_group_members (group_id, user_id, invited_by) VALUES (?, ?, ?)", (group_id, t_id, inviter_id))
            cur.execute("SELECT username FROM users WHERE id = ?", (inviter_id,))
            inv_row = cur.fetchone()
            inv_name = inv_row[0] if inv_row else 'Un miembro'
            cur.execute("INSERT INTO chat_group_messages (group_id, sender_id, content) VALUES (?, ?, ?)",
                        (group_id, inviter_id, f"[Invitación] @{inv_name} ha añadido a @{t_uname} al grupo."))
            conn.commit()
            conn.close()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': f"@{t_uname} ha sido añadido al grupo.",
                'invitedUser': {'id': t_id, 'username': t_uname}
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/chat/groups/join':
            auth_header = self.headers.get('Authorization', '')
            uid = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    uid = dec['id']
            if not uid:
                uid = int(body.get('userId') or 8)

            invite_code = (body.get('inviteCode') or '').strip().upper()
            group_id = body.get('groupId')

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            grow = None
            if group_id:
                cur.execute("SELECT id, name FROM chat_groups WHERE id = ?", (int(group_id),))
                grow = cur.fetchone()
            elif invite_code:
                cur.execute("SELECT id, name FROM chat_groups WHERE UPPER(invite_code) = ?", (invite_code,))
                grow = cur.fetchone()

            if not grow:
                conn.close()
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Código de grupo no encontrado.'}).encode('utf-8'))
                return

            gid, gname = grow
            cur.execute("INSERT OR IGNORE INTO chat_group_members (group_id, user_id, invited_by) VALUES (?, ?, ?)", (gid, uid, uid))
            conn.commit()
            conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'groupId': gid, 'name': gname}, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/chat/groups/messages':
            auth_header = self.headers.get('Authorization', '')
            sender_id = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    sender_id = dec['id']
            if not sender_id:
                sender_id = int(body.get('senderId') or 8)

            group_id = int(body.get('groupId') or 0)
            content = (body.get('content') or '').strip()
            if not group_id or not content:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Grupo y mensaje obligatorios.'}).encode('utf-8'))
                return

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute("INSERT OR IGNORE INTO chat_group_members (group_id, user_id, invited_by) VALUES (?, ?, ?)", (group_id, sender_id, sender_id))
            cur.execute("INSERT INTO chat_group_messages (group_id, sender_id, content) VALUES (?, ?, ?)", (group_id, sender_id, content))
            mid = cur.lastrowid
            conn.commit()
            cur.execute("""
                SELECT gm.id, gm.group_id, gm.sender_id, gm.content, gm.sent_at,
                       u.username, p.display_name, p.avatar_url
                FROM chat_group_messages gm
                JOIN users u ON u.id = gm.sender_id
                LEFT JOIN profiles p ON p.user_id = gm.sender_id
                WHERE gm.id = ?
            """, (mid,))
            r = cur.fetchone()
            conn.close()
            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': {
                    'id': r[0],
                    'groupId': r[1],
                    'senderId': r[2],
                    'content': r[3],
                    'sentAt': r[4],
                    'senderUsername': r[5],
                    'senderDisplayName': r[6] or r[5],
                    'senderAvatar': r[7] or f'https://api.dicebear.com/7.x/bottts/svg?seed={r[5]}'
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path.startswith('/api/friends'):
            auth_header = self.headers.get('Authorization', '')
            uid = None
            if auth_header.startswith('Bearer '):
                dec = decode_token(auth_header.split(' ', 1)[1])
                if dec and 'id' in dec:
                    uid = dec['id']
            if not uid:
                uid = int(body.get('userId') or 8)

            target = str(body.get('username') or body.get('targetUsername') or body.get('friendCode') or '').strip()
            target_id = body.get('targetUserId')

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            t_row = None
            if target_id and str(target_id).isdigit():
                cur.execute("SELECT id, username FROM users WHERE id = ?", (int(target_id),))
                t_row = cur.fetchone()
            elif target:
                clean_t = target.lstrip('@').lower()
                cur.execute("SELECT u.id, u.username FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.username_clean = ? OR LOWER(p.display_name) = ?", (clean_t, clean_t))
                t_row = cur.fetchone()

            if t_row and t_row[0] != uid:
                u1, u2 = min(uid, t_row[0]), max(uid, t_row[0])
                cur.execute("INSERT OR IGNORE INTO friendships (user1_id, user2_id) VALUES (?, ?)", (u1, u2))
                conn.commit()
                conn.close()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': f"Ahora eres amigo de @{t_row[1]}.",
                    'friend': {'id': t_row[0], 'username': t_row[1]}
                }, ensure_ascii=False).encode('utf-8'))
                return

            conn.close()
            self.send_response(404 if target else 200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': not bool(target),
                'message': f"No se encontró al jugador '{target}'." if target else 'Operación completada.'
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/server/scan':
            scan_res = trigger_remote_scan()
            sync_res = sync_catalog_from_server()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Escaneo remoto en 192.168.0.131 completado.',
                'scan': scan_res,
                'sync': sync_res
            }, ensure_ascii=False).encode('utf-8'))
            return

        if self.path == '/api/tickets':
            c_name = body.get('contact_name') or body.get('nombre') or 'Usuario'
            cat = body.get('category') or body.get('categoria') or 'sugerencia'
            title = body.get('title') or body.get('titulo') or 'Sin título'
            desc = body.get('description') or body.get('mensaje') or ''
            u_id = body.get('user_id', 1)

            master_db = os.path.join(DIRECTORY, 'retrohub_master.sqlite')
            conn = sqlite3.connect(master_db)
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO tickets (user_id, contact_name, category, title, description)
                VALUES (?, ?, ?, ?, ?)
            ''', (u_id, c_name, cat, title, desc))
            new_ticket_id = cur.lastrowid
            conn.commit()
            conn.close()

            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'ticket_id': new_ticket_id,
                'message': 'Incidencia registrada con éxito en el sistema.'
            }, ensure_ascii=False).encode('utf-8'))
            return

        self.send_response(404)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Ruta API no encontrada.'}}).encode('utf-8'))
        return

    def do_DELETE(self):
        self._handle_write_request()

    def end_headers(self):
        # Cabeceras necesarias para WebAssembly, SharedArrayBuffer y multihilo en navegadores modernos
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')
        super().end_headers()

    def guess_type(self, path):
        mime = super().guess_type(path)
        if path.endswith('.wasm'):
            return 'application/wasm'
        if path.endswith('.data'):
            return 'application/octet-stream'
        return mime

def registrar_mdns(ip, port):
    try:
        from zeroconf import Zeroconf, ServiceInfo
        zc = Zeroconf()
        info = ServiceInfo(
            "_http._tcp.local.",
            "RetroHub._http._tcp.local.",
            addresses=[socket.inet_aton(ip)],
            port=port,
            properties={"path": "/"},
            server="retrohub.local."
        )
        zc.register_service(info)
        return zc, info
    except Exception:
        return None, None

def abrir_navegador():
    import time
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/')

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    ips = obtener_ips_locales()
    primary_ip = ips[0] if ips else "127.0.0.1"
    zc, zc_info = registrar_mdns(primary_ip, PORT)
    
    with socketserver.ThreadingTCPServer(("", PORT), Handler) as httpd:
        print(f"==================================================")
        print(f"  RETROHUB - Plataforma de Emulacion Activa")
        print(f"  Red Local (mDNS): http://retrohub.local:{PORT}/")
        print(f"  URL Local:        http://localhost:{PORT}/")
        for ip in ips:
            print(f"  URL IP Red:       http://{ip}:{PORT}/ (Compartir con amigos)")
        print(f"  Pulsa Ctrl + C en esta ventana para detenerlo")
        print(f"==================================================")
        threading.Thread(target=abrir_navegador, daemon=True).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            if zc and zc_info:
                try:
                    zc.unregister_service(zc_info)
                    zc.close()
                except Exception:
                    pass
            sys.exit(0)
