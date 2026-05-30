import * as Blockly from "blockly/core";

// ---------------------------------------------------------------------------
// Custom kid-friendly block definitions for KidPlays Studio.
//
// We use Scratch-like categories and colors. Hat blocks (events) have a top
// "cap" shape; statements stack; reporters are rounded value blocks; booleans
// are hexagonal. The KidPlays VM (see ../vm/interpreter.js) reads these block
// types directly to run a project.
// ---------------------------------------------------------------------------

export const COLORS = {
  events: "#FFBF00",
  motion: "#4C97FF",
  looks: "#9966FF",
  sound: "#CF63CF",
  control: "#FFAB19",
  sensing: "#5CB1D6",
  operators: "#59C059",
  variables: "#FF8C1A",
};

const blocks = [
  // ===== EVENTS (hats) =====================================================
  {
    type: "event_when_flag_clicked",
    message0: "when 🚩 clicked",
    nextStatement: null,
    colour: COLORS.events,
    tooltip: "Runs when you press the green flag (Go!).",
  },
  {
    type: "event_when_key_pressed",
    message0: "when %1 key pressed",
    args0: [
      {
        type: "field_dropdown",
        name: "KEY",
        options: [
          ["space", "space"],
          ["up arrow ⬆", "up"],
          ["down arrow ⬇", "down"],
          ["left arrow ⬅", "left"],
          ["right arrow ➡", "right"],
          ["any", "any"],
          ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["w", "w"],
          ["s", "s"], ["x", "x"], ["z", "z"],
        ],
      },
    ],
    nextStatement: null,
    colour: COLORS.events,
    tooltip: "Runs when a key is pressed.",
  },
  {
    type: "event_when_sprite_clicked",
    message0: "when this sprite clicked",
    nextStatement: null,
    colour: COLORS.events,
    tooltip: "Runs when you click this sprite on the stage.",
  },
  {
    type: "event_broadcast",
    message0: "broadcast %1",
    args0: [{ type: "field_input", name: "MSG", text: "message1" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.events,
    tooltip: "Send a message to all sprites.",
  },
  {
    type: "event_when_broadcast",
    message0: "when I get %1",
    args0: [{ type: "field_input", name: "MSG", text: "message1" }],
    nextStatement: null,
    colour: COLORS.events,
    tooltip: "Runs when a matching message is broadcast.",
  },

  // ===== MOTION ============================================================
  {
    type: "motion_move",
    message0: "move %1 steps",
    args0: [{ type: "input_value", name: "STEPS", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
    tooltip: "Move forward in the direction the sprite is facing.",
  },
  {
    type: "motion_turn_right",
    message0: "turn ↻ %1 degrees",
    args0: [{ type: "input_value", name: "DEG", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_turn_left",
    message0: "turn ↺ %1 degrees",
    args0: [{ type: "input_value", name: "DEG", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_goto_xy",
    message0: "go to x %1 y %2",
    args0: [
      { type: "input_value", name: "X", check: "Number" },
      { type: "input_value", name: "Y", check: "Number" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_glide",
    message0: "glide %1 secs to x %2 y %3",
    args0: [
      { type: "input_value", name: "SECS", check: "Number" },
      { type: "input_value", name: "X", check: "Number" },
      { type: "input_value", name: "Y", check: "Number" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
    tooltip: "Smoothly slide to a spot over time.",
  },
  {
    type: "motion_point_direction",
    message0: "point in direction %1",
    args0: [{ type: "input_value", name: "DEG", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_change_x",
    message0: "change x by %1",
    args0: [{ type: "input_value", name: "DX", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_change_y",
    message0: "change y by %1",
    args0: [{ type: "input_value", name: "DY", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    inputsInline: true,
  },
  {
    type: "motion_bounce",
    message0: "if on edge, bounce",
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.motion,
    tooltip: "Bounce off the edge of the stage.",
  },
  {
    type: "motion_x_position",
    message0: "x position",
    output: "Number",
    colour: COLORS.motion,
  },
  {
    type: "motion_y_position",
    message0: "y position",
    output: "Number",
    colour: COLORS.motion,
  },
  {
    type: "motion_direction",
    message0: "direction",
    output: "Number",
    colour: COLORS.motion,
  },

  // ===== LOOKS =============================================================
  {
    type: "looks_say",
    message0: "say %1",
    args0: [{ type: "input_value", name: "TEXT" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
    inputsInline: true,
  },
  {
    type: "looks_say_for",
    message0: "say %1 for %2 seconds",
    args0: [
      { type: "input_value", name: "TEXT" },
      { type: "input_value", name: "SECS", check: "Number" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
    inputsInline: true,
  },
  {
    type: "looks_think",
    message0: "think %1",
    args0: [{ type: "input_value", name: "TEXT" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
    inputsInline: true,
  },
  {
    type: "looks_switch_costume",
    message0: "switch costume to %1",
    args0: [
      {
        type: "field_dropdown",
        name: "COSTUME",
        options: [
          ["🐱 cat", "cat"], ["🐶 dog", "dog"], ["🐸 frog", "frog"],
          ["🤖 robot", "robot"], ["🦄 unicorn", "unicorn"], ["🚀 rocket", "rocket"],
          ["⭐ star", "star"], ["⚽ ball", "ball"], ["👻 ghost", "ghost"],
          ["🐲 dragon", "dragon"], ["🦋 butterfly", "butterfly"], ["🍎 apple", "apple"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
  },
  {
    type: "looks_change_size",
    message0: "change size by %1",
    args0: [{ type: "input_value", name: "DELTA", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
    inputsInline: true,
  },
  {
    type: "looks_set_size",
    message0: "set size to %1 %%",
    args0: [{ type: "input_value", name: "SIZE", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
    inputsInline: true,
  },
  {
    type: "looks_show",
    message0: "show",
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
  },
  {
    type: "looks_hide",
    message0: "hide",
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.looks,
  },
  {
    type: "looks_size",
    message0: "size",
    output: "Number",
    colour: COLORS.looks,
  },

  // ===== SOUND =============================================================
  {
    type: "sound_play",
    message0: "play sound %1",
    args0: [
      {
        type: "field_dropdown",
        name: "SOUND",
        options: [
          ["meow 🐱", "meow"], ["beep 🔔", "beep"], ["boop", "boop"],
          ["pop 🎈", "pop"], ["drum 🥁", "drum"], ["laser 🔫", "laser"],
          ["coin 🪙", "coin"], ["jump", "jump"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.sound,
  },
  {
    type: "sound_play_note",
    message0: "play note %1 for %2 secs",
    args0: [
      {
        type: "field_dropdown",
        name: "NOTE",
        options: [
          ["C", "60"], ["D", "62"], ["E", "64"], ["F", "65"],
          ["G", "67"], ["A", "69"], ["B", "71"], ["high C", "72"],
        ],
      },
      { type: "input_value", name: "SECS", check: "Number" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.sound,
    inputsInline: true,
  },

  // ===== CONTROL ===========================================================
  {
    type: "control_wait",
    message0: "wait %1 seconds",
    args0: [{ type: "input_value", name: "SECS", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
    inputsInline: true,
  },
  {
    type: "control_repeat",
    message0: "repeat %1",
    args0: [{ type: "input_value", name: "TIMES", check: "Number" }],
    message1: "%1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
    inputsInline: true,
  },
  {
    type: "control_forever",
    message0: "forever",
    message1: "%1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    colour: COLORS.control,
    tooltip: "Loop these blocks forever.",
  },
  {
    type: "control_if",
    message0: "if %1 then",
    args0: [{ type: "input_value", name: "COND", check: "Boolean" }],
    message1: "%1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
  },
  {
    type: "control_if_else",
    message0: "if %1 then",
    args0: [{ type: "input_value", name: "COND", check: "Boolean" }],
    message1: "%1",
    args1: [{ type: "input_statement", name: "DO" }],
    message2: "else",
    message3: "%1",
    args3: [{ type: "input_statement", name: "ELSE" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
  },
  {
    type: "control_repeat_until",
    message0: "repeat until %1",
    args0: [{ type: "input_value", name: "COND", check: "Boolean" }],
    message1: "%1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
  },
  {
    type: "control_wait_until",
    message0: "wait until %1",
    args0: [{ type: "input_value", name: "COND", check: "Boolean" }],
    previousStatement: null,
    nextStatement: null,
    colour: COLORS.control,
  },
  {
    type: "control_stop",
    message0: "stop %1",
    args0: [
      {
        type: "field_dropdown",
        name: "WHAT",
        options: [
          ["all", "all"],
          ["this script", "this"],
        ],
      },
    ],
    previousStatement: null,
    colour: COLORS.control,
  },

  // ===== SENSING ===========================================================
  {
    type: "sensing_touching_edge",
    message0: "touching edge?",
    output: "Boolean",
    colour: COLORS.sensing,
  },
  {
    type: "sensing_key_pressed",
    message0: "key %1 pressed?",
    args0: [
      {
        type: "field_dropdown",
        name: "KEY",
        options: [
          ["space", "space"], ["up arrow ⬆", "up"], ["down arrow ⬇", "down"],
          ["left arrow ⬅", "left"], ["right arrow ➡", "right"],
          ["a", "a"], ["w", "w"], ["s", "s"], ["d", "d"],
        ],
      },
    ],
    output: "Boolean",
    colour: COLORS.sensing,
  },
  {
    type: "sensing_mouse_x",
    message0: "mouse x",
    output: "Number",
    colour: COLORS.sensing,
  },
  {
    type: "sensing_mouse_y",
    message0: "mouse y",
    output: "Number",
    colour: COLORS.sensing,
  },
  {
    type: "sensing_timer",
    message0: "timer",
    output: "Number",
    colour: COLORS.sensing,
    tooltip: "Seconds since the project started.",
  },

  // ===== OPERATORS =========================================================
  {
    type: "operator_arithmetic",
    message0: "%1 %2 %3",
    args0: [
      { type: "input_value", name: "A", check: "Number" },
      {
        type: "field_dropdown",
        name: "OP",
        options: [["+", "ADD"], ["−", "MINUS"], ["×", "MULTIPLY"], ["÷", "DIVIDE"]],
      },
      { type: "input_value", name: "B", check: "Number" },
    ],
    output: "Number",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_random",
    message0: "pick random %1 to %2",
    args0: [
      { type: "input_value", name: "FROM", check: "Number" },
      { type: "input_value", name: "TO", check: "Number" },
    ],
    output: "Number",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_compare",
    message0: "%1 %2 %3",
    args0: [
      { type: "input_value", name: "A" },
      {
        type: "field_dropdown",
        name: "OP",
        options: [["<", "LT"], ["=", "EQ"], [">", "GT"]],
      },
      { type: "input_value", name: "B" },
    ],
    output: "Boolean",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_and",
    message0: "%1 and %2",
    args0: [
      { type: "input_value", name: "A", check: "Boolean" },
      { type: "input_value", name: "B", check: "Boolean" },
    ],
    output: "Boolean",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_or",
    message0: "%1 or %2",
    args0: [
      { type: "input_value", name: "A", check: "Boolean" },
      { type: "input_value", name: "B", check: "Boolean" },
    ],
    output: "Boolean",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_not",
    message0: "not %1",
    args0: [{ type: "input_value", name: "A", check: "Boolean" }],
    output: "Boolean",
    colour: COLORS.operators,
    inputsInline: true,
  },
  {
    type: "operator_join",
    message0: "join %1 %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    output: "String",
    colour: COLORS.operators,
    inputsInline: true,
  },
];

let registered = false;

// Define all custom blocks plus a couple of value primitives.
export function registerBlocks() {
  if (registered) return;
  Blockly.common.defineBlocksWithJsonArray(blocks);

  // Simple number primitive (used as shadow inputs everywhere).
  Blockly.common.defineBlocksWithJsonArray([
    {
      type: "math_number_kid",
      message0: "%1",
      args0: [{ type: "field_number", name: "NUM", value: 10 }],
      output: "Number",
      colour: COLORS.operators,
    },
    {
      type: "text_kid",
      message0: "%1",
      args0: [{ type: "field_input", name: "TEXT", text: "Hello!" }],
      output: "String",
      colour: COLORS.operators,
    },
  ]);

  registered = true;
}
