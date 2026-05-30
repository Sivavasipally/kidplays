"""
Import the tutorial example projects into your local KidPlays Studio.

After running this, open KidPlays Studio and click "📂 Open" — the example
games will be waiting for you in "My Projects".

Usage (with the backend running):
    python tutorials/import_examples.py
"""
import json
import os
import sys
import urllib.request
import urllib.error

# Make printing safe on older Windows consoles (cp1252).
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

API = os.environ.get("KIDPLAYS_API", "http://localhost:5000/api")
PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "projects")


def get_json(url):
    with urllib.request.urlopen(url, timeout=5) as resp:
        return json.loads(resp.read().decode("utf-8"))


def post_project(payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{API}/projects",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    files = sorted(f for f in os.listdir(PROJECTS_DIR) if f.endswith(".json"))
    if not files:
        print("No project files found. Run: node tutorials/projects/_generate.mjs")
        return 1

    # Skip projects that are already imported (match by name).
    try:
        existing = {p["name"] for p in get_json(f"{API}/projects")}
    except urllib.error.URLError as exc:
        print(f"[x] Could not reach the backend at {API}: {exc}")
        print("    Start it first:  cd backend && python app.py")
        return 1

    print(f"Importing example projects into {API} ...")
    added = skipped = 0
    for name in files:
        with open(os.path.join(PROJECTS_DIR, name), "r", encoding="utf-8") as fh:
            payload = json.load(fh)
        if payload["name"] in existing:
            print(f"  [-] {payload['name']} (already imported, skipped)")
            skipped += 1
            continue
        try:
            result = post_project(payload)
            print(f"  [ok] {payload['name']}  (id={result['id']})")
            added += 1
        except urllib.error.URLError as exc:
            print(f"  [x] {payload['name']}: {exc}")
            return 1
    print(f"\nDone! Added {added}, skipped {skipped}. "
          "Open KidPlays Studio and click 'Open'.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
