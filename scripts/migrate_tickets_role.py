import sqlite3
import os

db_path = 'retrohub_master.sqlite'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Check users columns
user_cols = [c[1] for c in cur.execute('PRAGMA table_info(users)').fetchall()]
if 'role' not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
    print('Added role column to users')

# Ensure Sariwiiwi has admin role
cur.execute("UPDATE users SET role = 'admin' WHERE username = 'Sariwiiwi' OR email = 'saragomezmanzanares@gmail.com'")
print(f'Updated Sariwiiwi to admin (rows affected: {cur.rowcount})')

# Ensure tickets table exists with all columns
cur.execute('''
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    contact_name TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'media',
    system_console TEXT DEFAULT '',
    status TEXT DEFAULT 'open',
    admin_response TEXT DEFAULT NULL,
    admin_responder_id INTEGER DEFAULT NULL,
    admin_responder_name TEXT DEFAULT NULL,
    responded_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

ticket_cols = [c[1] for c in cur.execute('PRAGMA table_info(tickets)').fetchall()]
for col, defn in [
    ('priority', "TEXT DEFAULT 'media'"),
    ('system_console', "TEXT DEFAULT ''"),
    ('admin_response', "TEXT DEFAULT NULL"),
    ('admin_responder_id', "INTEGER DEFAULT NULL"),
    ('admin_responder_name', "TEXT DEFAULT NULL"),
    ('responded_at', "DATETIME DEFAULT NULL"),
]:
    if col not in ticket_cols:
        cur.execute(f"ALTER TABLE tickets ADD COLUMN {col} {defn}")
        print(f"Added {col} to tickets")

# Create ticket_replies table
cur.execute('''
CREATE TABLE IF NOT EXISTS ticket_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT DEFAULT 'user',
    avatar_url TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
)
''')
print('Checked ticket_replies table')

# Ensure tables are ready without inserting any fake or demo data
conn.commit()

print('Users:')
for r in cur.execute('SELECT id, username, email, role FROM users').fetchall():
    print(r)

print('Tickets:')
for r in cur.execute('SELECT id, contact_name, category, title, status, priority, admin_responder_name FROM tickets').fetchall():
    print(r)

conn.close()
