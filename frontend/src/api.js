// ---------------------------------------------------------------------------
// Local, server-free project storage for KidPlays Studio.
//
// The app is fully static — it saves projects in the browser (localStorage)
// instead of talking to a backend. This keeps the same async `api` interface
// the components already use, so nothing else had to change. It also means the
// whole app can be hosted on GitHub Pages with no server at all.
// ---------------------------------------------------------------------------

const KEY = "kidplays:projects";
const SEQ = "kidplays:projectSeq";

function readAll() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function nextId() {
  const n = (parseInt(localStorage.getItem(SEQ) || "0", 10) || 0) + 1;
  localStorage.setItem(SEQ, String(n));
  return n;
}

const nowIso = () => new Date().toISOString();
const eq = (a, b) => String(a) === String(b);

// Project list rows omit the (potentially large) `data` blob.
const meta = (p) => ({
  id: p.id,
  name: p.name,
  thumbnail: p.thumbnail ?? null,
  created_at: p.created_at,
  updated_at: p.updated_at,
});

export const api = {
  health: async () => ({ status: "ok", storage: "local" }),

  listProjects: async () =>
    readAll()
      .slice()
      .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")))
      .map(meta),

  getProject: async (id) => {
    const p = readAll().find((x) => eq(x.id, id));
    if (!p) throw new Error("Project not found");
    return p;
  },

  createProject: async ({ name, data, thumbnail } = {}) => {
    const list = readAll();
    const ts = nowIso();
    const rec = {
      id: nextId(),
      name: (name || "Untitled Project").slice(0, 120),
      data: data ?? {},
      thumbnail: thumbnail ?? null,
      created_at: ts,
      updated_at: ts,
    };
    list.push(rec);
    writeAll(list); // may throw if storage is full — callers handle it
    return rec;
  },

  updateProject: async (id, payload = {}) => {
    const list = readAll();
    const i = list.findIndex((x) => eq(x.id, id));
    if (i < 0) throw new Error("Project not found");
    const cur = list[i];
    const updated = {
      ...cur,
      name: payload.name != null ? String(payload.name).slice(0, 120) : cur.name,
      data: payload.data !== undefined ? payload.data : cur.data,
      thumbnail: payload.thumbnail !== undefined ? payload.thumbnail : cur.thumbnail,
      updated_at: nowIso(),
    };
    list[i] = updated;
    writeAll(list);
    return updated;
  },

  deleteProject: async (id) => {
    writeAll(readAll().filter((x) => !eq(x.id, id)));
    return { status: "deleted", id };
  },
};
