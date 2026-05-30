import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import * as En from "blockly/msg/en";
import { registerBlocks } from "../blocks/definitions.js";
import { toolbox } from "../blocks/toolbox.js";
import { useStore } from "../store.js";

Blockly.setLocale(En);
registerBlocks();

// A rounded, kid-friendly theme.
const kidTheme = Blockly.Theme.defineTheme("kidplays", {
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#f4f7ff",
    toolboxBackgroundColour: "#ffffff",
    flyoutBackgroundColour: "#eef2ff",
    flyoutOpacity: 0.98,
    scrollbarColour: "#c7d2fe",
    insertionMarkerColour: "#1e293b",
    insertionMarkerOpacity: 0.3,
  },
  fontStyle: { family: "Baloo 2, Comic Sans MS, system-ui, sans-serif", size: 12, weight: "600" },
});

/**
 * One Blockly editor that shows the currently selected sprite's blocks.
 * When the selected sprite changes, we save the old workspace and load the new
 * one — so each sprite keeps its own scripts (just like Scratch).
 */
export default function BlocklyWorkspace() {
  const divRef = useRef(null);
  const wsRef = useRef(null);
  const currentSpriteRef = useRef(null);
  const ignoreChangesRef = useRef(false);

  const selectedSpriteId = useStore((s) => s.selectedSpriteId);
  const setSpriteWorkspace = useStore((s) => s.setSpriteWorkspace);

  // Create the Blockly workspace once.
  useEffect(() => {
    const ws = Blockly.inject(divRef.current, {
      toolbox,
      theme: kidTheme,
      renderer: "zelos", // the rounded, Scratch-like renderer
      grid: { spacing: 28, length: 3, colour: "#e2e8f0", snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 2, minScale: 0.4 },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      sounds: false,
    });
    wsRef.current = ws;

    // Persist changes back into the store (debounced via the change event).
    const onChange = (e) => {
      if (ignoreChangesRef.current) return;
      if (e.isUiEvent) return;
      const sid = currentSpriteRef.current;
      if (!sid) return;
      const json = Blockly.serialization.workspaces.save(ws);
      setSpriteWorkspace(sid, json);
    };
    ws.addChangeListener(onChange);

    const onResize = () => Blockly.svgResize(ws);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ws.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap workspace content when the selected sprite changes.
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    // Save outgoing sprite first.
    const prev = currentSpriteRef.current;
    if (prev && prev !== selectedSpriteId) {
      const json = Blockly.serialization.workspaces.save(ws);
      setSpriteWorkspace(prev, json);
    }

    // Load incoming sprite.
    const sprite = useStore.getState().sprites.find((s) => s.id === selectedSpriteId);
    ignoreChangesRef.current = true;
    ws.clear();
    if (sprite?.workspace) {
      try {
        Blockly.serialization.workspaces.load(sprite.workspace, ws);
      } catch (err) {
        console.warn("Failed to load sprite workspace", err);
      }
    }
    ignoreChangesRef.current = false;
    currentSpriteRef.current = selectedSpriteId;
    setTimeout(() => Blockly.svgResize(ws), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpriteId]);

  return <div ref={divRef} className="blockly-host" />;
}
