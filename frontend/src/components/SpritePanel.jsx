import React from "react";
import { useStore, COSTUMES, BACKDROPS } from "../store.js";

// A panel card whose body folds away when its title is clicked. Open/closed
// state is remembered in the layout store, so kids can tidy their workspace.
function CollapsibleCard({ panelKey, title, extra, children }) {
  const open = useStore((s) => s.layout.panels[panelKey]);
  const togglePanel = useStore((s) => s.togglePanel);
  return (
    <div className={`panel-card ${open ? "" : "collapsed"}`}>
      <div className="panel-title-row">
        <button
          className="panel-title as-toggle"
          onClick={() => togglePanel(panelKey)}
          aria-expanded={open}
        >
          <span className={`fold-chevron ${open ? "open" : ""}`}>▸</span>
          {title}
        </button>
        {extra}
      </div>
      {open && <div className="panel-content">{children}</div>}
    </div>
  );
}

export default function SpritePanel() {
  const sprites = useStore((s) => s.sprites);
  const selectedId = useStore((s) => s.selectedSpriteId);
  const backdrop = useStore((s) => s.backdrop);
  const selectSprite = useStore((s) => s.selectSprite);
  const addSprite = useStore((s) => s.addSprite);
  const deleteSprite = useStore((s) => s.deleteSprite);
  const updateSprite = useStore((s) => s.updateSprite);
  const setBackdrop = useStore((s) => s.setBackdrop);

  const selected = sprites.find((s) => s.id === selectedId) || sprites[0];
  const emoji = (id) => COSTUMES.find((c) => c.id === id)?.emoji || "🐱";

  return (
    <div className="sprite-panel">
      {/* Properties of the selected sprite */}
      <CollapsibleCard panelKey="props" title={`✨ ${selected.name}`}>
        <div className="prop-grid">
          <label>Name
            <input
              value={selected.name}
              onChange={(e) => updateSprite(selected.id, { name: e.target.value })}
            />
          </label>
          <div className="prop-row">
            <label>x
              <input
                type="number"
                value={Math.round(selected.x)}
                onChange={(e) => updateSprite(selected.id, { x: Number(e.target.value) })}
              />
            </label>
            <label>y
              <input
                type="number"
                value={Math.round(selected.y)}
                onChange={(e) => updateSprite(selected.id, { y: Number(e.target.value) })}
              />
            </label>
          </div>
          <div className="prop-row">
            <label>size
              <input
                type="number"
                value={Math.round(selected.size)}
                onChange={(e) => updateSprite(selected.id, { size: Number(e.target.value) })}
              />
            </label>
            <label>dir
              <input
                type="number"
                value={Math.round(selected.direction)}
                onChange={(e) => updateSprite(selected.id, { direction: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="show-toggle">
            <input
              type="checkbox"
              checked={selected.visible}
              onChange={(e) => updateSprite(selected.id, { visible: e.target.checked })}
            />
            Show on stage
          </label>
        </div>

        <div className="panel-subtitle">Pick a costume</div>
        <div className="costume-grid">
          {COSTUMES.map((c) => (
            <button
              key={c.id}
              className={`costume-btn ${selected.costume === c.id ? "active" : ""}`}
              title={c.name}
              onClick={() => updateSprite(selected.id, { costume: c.id })}
            >
              {c.emoji}
            </button>
          ))}
        </div>
      </CollapsibleCard>

      {/* Sprite list */}
      <CollapsibleCard
        panelKey="sprites"
        title="🎭 Sprites"
        extra={
          <button className="add-btn" onClick={addSprite}>
            ＋ Add
          </button>
        }
      >
        <div className="sprite-grid">
          {sprites.map((s) => (
            <div
              key={s.id}
              className={`sprite-tile ${s.id === selectedId ? "active" : ""}`}
              onClick={() => selectSprite(s.id)}
            >
              <span className="sprite-emoji">{emoji(s.costume)}</span>
              <span className="sprite-name">{s.name}</span>
              {sprites.length > 1 && (
                <button
                  className="sprite-del"
                  title="Delete sprite"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSprite(s.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* Backdrop picker */}
      <CollapsibleCard panelKey="backdrop" title="🌈 Backdrop">
        <div className="backdrop-grid">
          {BACKDROPS.map((b) => (
            <button
              key={b.id}
              className={`backdrop-btn ${backdrop === b.id ? "active" : ""}`}
              style={{ background: b.css }}
              title={b.name}
              onClick={() => setBackdrop(b.id)}
            />
          ))}
        </div>
      </CollapsibleCard>
    </div>
  );
}
