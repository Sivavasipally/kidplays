// ---------------------------------------------------------------------------
// Ready-to-play example projects. Each sprite's scripts are stored in Blockly's
// serialization format. Small builder helpers keep them readable.
// ---------------------------------------------------------------------------

const num = (n) => ({ shadow: { type: "math_number_kid", fields: { NUM: n } } });
const txt = (t) => ({ shadow: { type: "text_kid", fields: { TEXT: t } } });

// Build a block; `next` is the following statement block (auto-wrapped).
function b(type, { fields, inputs, next } = {}) {
  const block = { type };
  if (fields) block.fields = fields;
  if (inputs) block.inputs = inputs;
  if (next) block.next = { block: next };
  return block;
}

// Chain a list of statement blocks into a single linked stack.
function stack(list) {
  for (let i = list.length - 1; i > 0; i--) {
    list[i - 1].next = { block: list[i] };
  }
  return list[0];
}

// A hat block at position (x,y) with a body stack.
function script(x, y, hat, bodyList) {
  hat.x = x;
  hat.y = y;
  if (bodyList && bodyList.length) hat.next = { block: stack(bodyList) };
  return hat;
}

function ws(blocks, variables = []) {
  return { blocks: { languageVersion: 0, blocks }, variables };
}

// --- Example 1: Dancing Cat --------------------------------------------------
const dancingCat = {
  name: "Dancing Cat",
  icon: "🐱",
  data: {
    projectName: "Dancing Cat",
    backdrop: "sunset",
    sprites: [
      {
        id: "s-cat",
        name: "Cat",
        costume: "cat",
        x: 0, y: 0, direction: 90, size: 120, visible: true,
        workspace: ws([
          script(40, 40, b("event_when_flag_clicked"), [
            b("control_forever", {
              inputs: {
                DO: {
                  block: stack([
                    b("motion_move", { inputs: { STEPS: num(15) } }),
                    b("motion_bounce"),
                    b("looks_change_size", { inputs: { DELTA: num(5) } }),
                    b("control_wait", { inputs: { SECS: num(0.1) } }),
                    b("looks_change_size", { inputs: { DELTA: num(-5) } }),
                  ]),
                },
              },
            }),
          ]),
        ]),
      },
    ],
  },
};

// --- Example 2: Star Catcher (click the star to score) -----------------------
const starCatcher = {
  name: "Star Catcher",
  icon: "⭐",
  data: {
    projectName: "Star Catcher",
    backdrop: "space",
    sprites: [
      {
        id: "s-star",
        name: "Star",
        costume: "star",
        x: 0, y: 0, direction: 90, size: 90, visible: true,
        workspace: ws(
          [
            script(40, 40, b("event_when_flag_clicked"), [
              b("variables_set", {
                fields: { VAR: { id: "v-score" } },
                inputs: { VALUE: num(0) },
              }),
              b("control_forever", {
                inputs: {
                  DO: {
                    block: stack([
                      b("motion_goto_xy", {
                        inputs: {
                          X: {
                            block: b("operator_random", {
                              inputs: { FROM: num(-200), TO: num(200) },
                            }),
                          },
                          Y: {
                            block: b("operator_random", {
                              inputs: { FROM: num(-140), TO: num(140) },
                            }),
                          },
                        },
                      }),
                      b("control_wait", { inputs: { SECS: num(0.9) } }),
                    ]),
                  },
                },
              }),
            ]),
            script(40, 320, b("event_when_sprite_clicked"), [
              b("math_change", {
                fields: { VAR: { id: "v-score" } },
                inputs: { DELTA: num(1) },
              }),
              b("sound_play", { fields: { SOUND: "coin" } }),
              b("looks_say", { inputs: { TEXT: txt("Yay! +1") } }),
            ]),
          ],
          [{ name: "score", id: "v-score" }]
        ),
      },
    ],
  },
};

// --- Example 3: Drive with Arrow Keys ---------------------------------------
const arrowDrive = {
  name: "Arrow Driver",
  icon: "🚀",
  data: {
    projectName: "Arrow Driver",
    backdrop: "grass",
    sprites: [
      {
        id: "s-rocket",
        name: "Rocket",
        costume: "rocket",
        x: 0, y: 0, direction: 90, size: 100, visible: true,
        workspace: ws([
          script(40, 40, b("event_when_key_pressed", { fields: { KEY: "up" } }), [
            b("motion_change_y", { inputs: { DY: num(12) } }),
          ]),
          script(40, 150, b("event_when_key_pressed", { fields: { KEY: "down" } }), [
            b("motion_change_y", { inputs: { DY: num(-12) } }),
          ]),
          script(40, 260, b("event_when_key_pressed", { fields: { KEY: "left" } }), [
            b("motion_change_x", { inputs: { DX: num(-12) } }),
          ]),
          script(40, 370, b("event_when_key_pressed", { fields: { KEY: "right" } }), [
            b("motion_change_x", { inputs: { DX: num(12) } }),
          ]),
          script(360, 40, b("event_when_flag_clicked"), [
            b("looks_say", { inputs: { TEXT: txt("Use arrow keys to fly me! 🚀") } }),
            b("motion_goto_xy", { inputs: { X: num(0), Y: num(0) } }),
          ]),
        ]),
      },
    ],
  },
};

// --- Example 4: Magic Show (two sprites talking with broadcasts) -------------
const magicShow = {
  name: "Magic Show",
  icon: "🦄",
  data: {
    projectName: "Magic Show",
    backdrop: "space",
    sprites: [
      {
        id: "s-wizard",
        name: "Unicorn",
        costume: "unicorn",
        x: -110, y: -20, direction: 90, size: 110, visible: true,
        workspace: ws([
          script(40, 40, b("event_when_sprite_clicked"), [
            b("looks_say", { inputs: { TEXT: txt("Abracadabra!") } }),
            b("event_broadcast", { fields: { MSG: "magic" } }),
          ]),
        ]),
      },
      {
        id: "s-magicstar",
        name: "Star",
        costume: "star",
        x: 120, y: 40, direction: 90, size: 80, visible: true,
        workspace: ws([
          script(40, 40, b("event_when_flag_clicked"), [
            b("looks_set_size", { inputs: { SIZE: num(80) } }),
            b("looks_say", { inputs: { TEXT: txt("Click the unicorn! ✨") } }),
          ]),
          script(40, 220, b("event_when_broadcast", { fields: { MSG: "magic" } }), [
            b("control_repeat", {
              inputs: {
                TIMES: num(10),
                DO: {
                  block: stack([
                    b("motion_turn_right", { inputs: { DEG: num(36) } }),
                    b("looks_change_size", { inputs: { DELTA: num(6) } }),
                    b("control_wait", { inputs: { SECS: num(0.05) } }),
                  ]),
                },
              },
            }),
            b("sound_play", { fields: { SOUND: "coin" } }),
            b("looks_set_size", { inputs: { SIZE: num(80) } }),
            b("looks_say", { inputs: { TEXT: txt("Ta-da! 🎉") } }),
          ]),
        ]),
      },
    ],
  },
};

export const EXAMPLES = [dancingCat, starCatcher, arrowDrive, magicShow];

