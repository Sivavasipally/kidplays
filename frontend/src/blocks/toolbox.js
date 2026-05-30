import { COLORS } from "./definitions.js";

// A small DSL → Blockly toolbox JSON. We build inputs with shadow children
// so kids always see an editable value inside each slot (just like Scratch).
function block(type, inputs = {}) {
  const b = { kind: "block", type };
  const keys = Object.keys(inputs);
  if (keys.length) {
    b.inputs = {};
    for (const key of keys) {
      const v = inputs[key];
      if (v && v.__shadow) {
        b.inputs[key] = { shadow: v.__shadow };
      }
    }
  }
  return b;
}

const N = (value = 10) => ({ __shadow: { type: "math_number_kid", fields: { NUM: value } } });
const T = (text = "Hello!") => ({ __shadow: { type: "text_kid", fields: { TEXT: text } } });

export const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Events",
      colour: COLORS.events,
      contents: [
        block("event_when_flag_clicked"),
        block("event_when_key_pressed"),
        block("event_when_sprite_clicked"),
        block("event_when_broadcast"),
        block("event_broadcast"),
      ],
    },
    {
      kind: "category",
      name: "Motion",
      colour: COLORS.motion,
      contents: [
        block("motion_move", { STEPS: N(10) }),
        block("motion_turn_right", { DEG: N(15) }),
        block("motion_turn_left", { DEG: N(15) }),
        block("motion_goto_xy", { X: N(0), Y: N(0) }),
        block("motion_glide", { SECS: N(1), X: N(0), Y: N(0) }),
        block("motion_point_direction", { DEG: N(90) }),
        block("motion_change_x", { DX: N(10) }),
        block("motion_change_y", { DY: N(10) }),
        block("motion_bounce"),
        block("motion_x_position"),
        block("motion_y_position"),
        block("motion_direction"),
      ],
    },
    {
      kind: "category",
      name: "Looks",
      colour: COLORS.looks,
      contents: [
        block("looks_say", { TEXT: T("Hi there!") }),
        block("looks_say_for", { TEXT: T("Hello!"), SECS: N(2) }),
        block("looks_think", { TEXT: T("Hmm...") }),
        block("looks_switch_costume"),
        block("looks_change_size", { DELTA: N(10) }),
        block("looks_set_size", { SIZE: N(100) }),
        block("looks_show"),
        block("looks_hide"),
        block("looks_size"),
      ],
    },
    {
      kind: "category",
      name: "Sound",
      colour: COLORS.sound,
      contents: [
        block("sound_play"),
        block("sound_play_note", { SECS: N(1) }),
      ],
    },
    {
      kind: "category",
      name: "Control",
      colour: COLORS.control,
      contents: [
        block("control_wait", { SECS: N(1) }),
        block("control_repeat", { TIMES: N(10) }),
        block("control_forever"),
        block("control_if"),
        block("control_if_else"),
        block("control_repeat_until"),
        block("control_wait_until"),
        block("control_stop"),
      ],
    },
    {
      kind: "category",
      name: "Sensing",
      colour: COLORS.sensing,
      contents: [
        block("sensing_touching_edge"),
        block("sensing_key_pressed"),
        block("sensing_mouse_x"),
        block("sensing_mouse_y"),
        block("sensing_timer"),
      ],
    },
    {
      kind: "category",
      name: "Operators",
      colour: COLORS.operators,
      contents: [
        block("operator_arithmetic", { A: N(5), B: N(3) }),
        block("operator_random", { FROM: N(1), TO: N(10) }),
        block("operator_compare", { A: N(1), B: N(5) }),
        block("operator_and"),
        block("operator_or"),
        block("operator_not"),
        block("operator_join", { A: T("apple "), B: T("pie") }),
        block("math_number_kid"),
        block("text_kid"),
      ],
    },
    {
      kind: "category",
      name: "Variables",
      colour: COLORS.variables,
      custom: "VARIABLE",
    },
  ],
};
