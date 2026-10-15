#!/usr/bin/env python3
"""
RetroHub Remote Server Bridge (himawari@192.168.0.131)
Handles SSH connectivity, remote scanning, and data synchronization.
"""

import os
import sys
import json
import subprocess
import shutil
from pathlib import Path

SERVER_HOST = "192.168.0.131"
SERVER_USER = "himawari"
REMOTE_DATA_DIR = "/home/himawari/retrohub-data"
LOCAL_ROOT = Path(__file__).resolve().parent.parent

def run_ssh(cmd, timeout=15):
    """Executes a command on the remote server via SSH without password prompt."""
    full_cmd = ["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=5", f"{SERVER_USER}@{SERVER_HOST}", cmd]
    try:
        res = subprocess.run(full_cmd, capture_output=True, text=True, timeout=timeout)
        return {
            "success": res.returncode == 0,
            "stdout": res.stdout.strip(),
            "stderr": res.stderr.strip(),
            "code": res.returncode
        }
    except Exception as e:
        return {"success": False, "stdout": "", "stderr": str(e), "code": -1}

def check_server_status():
    """Checks remote server status, available disk space, and directory health."""
    cmd = f"uname -a; df -h {REMOTE_DATA_DIR} | tail -1; ls -1 {REMOTE_DATA_DIR}/roms | wc -l"
    res = run_ssh(cmd)
    if not res["success"]:
        return {
            "online": False,
            "host": SERVER_HOST,
            "user": SERVER_USER,
            "error": res["stderr"] or "No se pudo conectar al servidor SSH"
        }
    lines = res["stdout"].split("\n")
    df_parts = lines[1].split() if len(lines) > 1 else []
    return {
        "online": True,
        "host": SERVER_HOST,
        "user": SERVER_USER,
        "kernel": lines[0] if lines else "Linux",
        "disk_free": df_parts[3] if len(df_parts) >= 4 else "N/A",
        "disk_usage": df_parts[4] if len(df_parts) >= 5 else "N/A",
        "system_folders": lines[2] if len(lines) > 2 else "11"
    }

def trigger_remote_scan():
    """Runs scanner.py on remote server to refresh catalog and SQLite database."""
    cmd = f"python3 {REMOTE_DATA_DIR}/scripts/scanner.py"
    res = run_ssh(cmd, timeout=30)
    return res

def sync_catalog_from_server():
    """Downloads catalogo.json from remote server to local ROMS/catalogo.json."""
    remote_src = f"{SERVER_USER}@{SERVER_HOST}:{REMOTE_DATA_DIR}/catalogo.json"
    local_dest = str(LOCAL_ROOT / "ROMS" / "catalogo.json")
    full_cmd = ["scp", "-o", "BatchMode=yes", "-o", "ConnectTimeout=5", remote_src, local_dest]
    try:
        res = subprocess.run(full_cmd, capture_output=True, text=True, timeout=10)
        if res.returncode == 0:
            with open(local_dest, "r", encoding="utf-8") as f:
                data = json.load(f)
            return {"success": True, "catalog": data}
        return {"success": False, "error": res.stderr.strip()}
    except Exception as e:
        return {"success": False, "error": str(e)}

def push_rom_to_server(local_file_path, system_id):
    """Uploads a new ROM file to the appropriate remote server folder."""
    local_path = Path(local_file_path)
    if not local_path.is_file():
        return {"success": False, "error": f"Archivo local no encontrado: {local_file_path}"}
    
    remote_dest = f"{SERVER_USER}@{SERVER_HOST}:{REMOTE_DATA_DIR}/roms/{system_id}/"
    full_cmd = ["scp", "-o", "BatchMode=yes", str(local_path), remote_dest]
    try:
        res = subprocess.run(full_cmd, capture_output=True, text=True, timeout=60)
        if res.returncode == 0:
            trigger_remote_scan()
            sync_catalog_from_server()
            return {"success": True, "filename": local_path.name, "system": system_id}
        return {"success": False, "error": res.stderr.strip()}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    print(f"=== Comprobando conexión a {SERVER_USER}@{SERVER_HOST} ===")
    status = check_server_status()
    print("Estado del servidor:", json.dumps(status, indent=2, ensure_ascii=False))
    
    if status["online"]:
        print("\n=== Ejecutando escaneo remoto ===")
        scan_res = trigger_remote_scan()
        print("Resultado escaneo:", scan_res["stdout"])
        
        print("\n=== Sincronizando catalogo.json localmente ===")
        sync_res = sync_catalog_from_server()
        if sync_res["success"]:
            total_roms = sum(len(v) for v in sync_res["catalog"].values())
            print(f"[OK] Catálogo sincronizado con éxito. Total ROMs: {total_roms}")
        else:
            print("[ERROR] Fallo sincronizando catálogo:", sync_res["error"])
