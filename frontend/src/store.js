import { create } from "zustand";

// ---------------------------------------------------------------------------
// Global app state for KidPlays Studio.
//
// A "project" is just data: a list of sprites + stage settings. Each sprite
// owns its own Blockly workspace (serialized as JSON), a costume, and a
// position on the stage. This mirrors how Scratch organizes things.
// ---------------------------------------------------------------------------

const COSTUMES = [
  { id: "cat", emoji: "🐱", name: "Cat" },
  { id: "dog", emoji: "🐶", name: "Dog" },
  { id: "frog", emoji: "🐸", name: "Frog" },
  { id: "robot", emoji: "🤖", name: "Robot" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  { id: "rocket", emoji: "🚀", name: "Rocket" },
  { id: "star", emoji: "⭐", name: "Star" },
  { id: "ball", emoji: "⚽", name: "Ball" },
  { id: "ghost", emoji: "👻", name: "Ghost" },
  { id: "dragon", emoji: "🐲", name: "Dragon" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly" },
  { id: "apple", emoji: "🍎", name: "Apple" },
];

const BACKDROPS = [
  { id: "white", name: "White", css: "#ffffff" },
  { id: "sky", name: "Sky", css: "linear-gradient(180deg,#aee9ff 0%,#e9fbff 100%)" },
  { id: "grass", name: "Grass", css: "linear-gradient(180deg,#bff0ff 0%,#bff0ff 55%,#8fe388 55%,#8fe388 100%)" },
  { id: "space", name: "Space", css: "radial-gradient(circle at 30% 20%,#3a2a6b,#10072e 70%)" },
  { id: "sunset", name: "Sunset", css: "linear-gradient(180deg,#ff9a8b 0%,#ffd36e 100%)" },
  { id: "ocean", name: "Ocean", css: "linear-gradient(180deg,#2bc0e4 0%,#114357 100%)" },
];

let spriteCounter = 0;
function makeSprite(partial = {}) {
  spriteCounter += 1;
  return {
    id: `sprite-${Date.now()}-${spriteCounter}`,
    name: partial.name || `Sprite${spriteCounter}`,
    costume: partial.costume || "cat",
    x: partial.x ?? 0,
    y: partial.y ?? 0,
    direction: partial.direction ?? 90,
    size: partial.size ?? 100,
    visible: partial.visible ?? true,
    workspace: partial.workspace || null, // serialized Blockly JSON
  };
}

const firstSprite = makeSprite({ name: "Cat", costume: "cat" });

export const useStore = create((set, get) => ({
  // ----- project meta -----
  projectId: null,
  projectName: "My First Game",
  backdrop: "sky",

  // ----- sprites -----
  sprites: [firstSprite],
  selectedSpriteId: firstSprite.id,

  // ----- runtime -----
  running: false,
  // Live runtime snapshot of sprites (positions/looks) shown on the stage while running.
  liveSprites: {},

  // ----- UI -----
  toast: null,

  // === selectors / mutations ============================================
  getSelectedSprite: () => {
    const { sprites, selectedSpriteId } = get();
    return sprites.find((s) => s.id === selectedSpriteId) || sprites[0];
  },

  selectSprite: (id) => set({ selectedSpriteId: id }),

  addSprite: () => {
    const costume = COSTUMES[Math.floor(Math.random() * COSTUMES.length)].id;
    const sprite = makeSprite({ costume });
    set((s) => ({ sprites: [...s.sprites, sprite], selectedSpriteId: sprite.id }));
  },

  deleteSprite: (id) =>
    set((s) => {
      if (s.sprites.length <= 1) return s; // always keep at least one
      const sprites = s.sprites.filter((sp) => sp.id !== id);
      const selectedSpriteId =
        s.selectedSpriteId === id ? sprites[0].id : s.selectedSpriteId;
      return { sprites, selectedSpriteId };
    }),

  updateSprite: (id, patch) =>
    set((s) => ({
      sprites: s.sprites.map((sp) => (sp.id === id ? { ...sp, ...patch } : sp)),
    })),

  setSpriteWorkspace: (id, workspaceJson) =>
    set((s) => ({
      sprites: s.sprites.map((sp) =>
        sp.id === id ? { ...sp, workspace: workspaceJson } : sp
      ),
    })),

  setBackdrop: (backdrop) => set({ backdrop }),
  setProjectName: (projectName) => set({ projectName }),
  setProjectId: (projectId) => set({ projectId }),

  setRunning: (running) => set({ running }),
  setLiveSprites: (liveSprites) => set({ liveSprites }),

  showToast: (text, kind = "info") => {
    set({ toast: { text, kind, at: Date.now() } });
    setTimeout(() => {
      const t = get().toast;
      if (t && Date.now() - t.at >= 2400) set({ toast: null });
    }, 2600);
  },

  // Replace the entire project (used on load / new).
  loadProject: (project) => {
    const data = project?.data || project;
    const sprites =
      Array.isArray(data?.sprites) && data.sprites.length
        ? data.sprites
        : [makeSprite({ name: "Cat", costume: "cat" })];
    set({
      projectId: project?.id ?? null,
      projectName: project?.name || data?.projectName || "My Project",
      backdrop: data?.backdrop || "sky",
      sprites,
      selectedSpriteId: sprites[0].id,
      liveSprites: {},
      running: false,
    });
  },

  newProject: () => {
    const sprite = makeSprite({ name: "Cat", costume: "cat" });
    set({
      projectId: null,
      projectName: "My New Project",
      backdrop: "sky",
      sprites: [sprite],
      selectedSpriteId: sprite.id,
      liveSprites: {},
      running: false,
    });
  },

  // Serialize the whole project into a saveable payload.
  serializeProject: () => {
    const { projectName, backdrop, sprites } = get();
    return { projectName, backdrop, sprites };
  },
}));

export { COSTUMES, BACKDROPS };
