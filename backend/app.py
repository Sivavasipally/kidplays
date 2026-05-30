"""
KidPlays Studio - Backend API
A standalone, local-first server for a kid-friendly block coding playground.

Storage: SQLite (no external services required). Runs fully offline on Windows.
"""
import os
import json
import sqlite3
from datetime import datetime, timezone
from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
DB_PATH = os.path.join(INSTANCE_DIR, "kidplays.db")
# Optional: serve a production build of the frontend if present.
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))

os.makedirs(INSTANCE_DIR, exist_ok=True)

app = Flask(__name__, static_folder=None)
CORS(app)


# --------------------------------------------------------------------------- #
# Database helpers
# --------------------------------------------------------------------------- #
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DB_PATH)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            data        TEXT NOT NULL,
            thumbnail   TEXT,
            created_at  TEXT NOT NULL,
            updated_at  TEXT NOT NULL
        )
        """
    )
    db.commit()
    db.close()


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def row_to_project(row, include_data=True):
    item = {
        "id": row["id"],
        "name": row["name"],
        "thumbnail": row["thumbnail"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
    if include_data:
        try:
            item["data"] = json.loads(row["data"])
        except (TypeError, json.JSONDecodeError):
            item["data"] = None
    return item


# --------------------------------------------------------------------------- #
# API routes
# --------------------------------------------------------------------------- #
@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "kidplays", "time": now_iso()})


@app.get("/api/projects")
def list_projects():
    db = get_db()
    rows = db.execute(
        "SELECT id, name, thumbnail, created_at, updated_at FROM projects ORDER BY updated_at DESC"
    ).fetchall()
    return jsonify([row_to_project(r, include_data=False) for r in rows])


@app.get("/api/projects/<int:project_id>")
def get_project(project_id):
    db = get_db()
    row = db.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Project not found"}), 404
    return jsonify(row_to_project(row))


@app.post("/api/projects")
def create_project():
    payload = request.get_json(force=True, silent=True) or {}
    name = (payload.get("name") or "Untitled Project").strip()[:120]
    data = payload.get("data", {})
    thumbnail = payload.get("thumbnail")
    ts = now_iso()
    db = get_db()
    cur = db.execute(
        "INSERT INTO projects (name, data, thumbnail, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (name, json.dumps(data), thumbnail, ts, ts),
    )
    db.commit()
    row = db.execute("SELECT * FROM projects WHERE id = ?", (cur.lastrowid,)).fetchone()
    return jsonify(row_to_project(row)), 201


@app.put("/api/projects/<int:project_id>")
def update_project(project_id):
    payload = request.get_json(force=True, silent=True) or {}
    db = get_db()
    row = db.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Project not found"}), 404

    name = (payload.get("name") or row["name"]).strip()[:120]
    data = payload.get("data", json.loads(row["data"]))
    thumbnail = payload.get("thumbnail", row["thumbnail"])
    db.execute(
        "UPDATE projects SET name = ?, data = ?, thumbnail = ?, updated_at = ? WHERE id = ?",
        (name, json.dumps(data), thumbnail, now_iso(), project_id),
    )
    db.commit()
    row = db.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    return jsonify(row_to_project(row))


@app.delete("/api/projects/<int:project_id>")
def delete_project(project_id):
    db = get_db()
    db.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    db.commit()
    return jsonify({"status": "deleted", "id": project_id})


# --------------------------------------------------------------------------- #
# Optional: serve the built frontend (so `python app.py` is a single command)
# --------------------------------------------------------------------------- #
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if not os.path.isdir(FRONTEND_DIST):
        return jsonify(
            {
                "message": "KidPlays Studio API is running.",
                "hint": "Run the frontend dev server (npm run dev) or build it (npm run build).",
            }
        )
    target = os.path.join(FRONTEND_DIST, path)
    if path and os.path.isfile(target):
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "5000"))
    print("=" * 60)
    print("  KidPlays Studio backend")
    print(f"  Database : {DB_PATH}")
    print(f"  API      : http://localhost:{port}/api")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=True)
