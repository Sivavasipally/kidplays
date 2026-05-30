// Generates importable project .json files from the app's built-in examples,
// so the tutorial projects always match what ships in the editor.
//   Run:  node tutorials/projects/_generate.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXAMPLES } from "../../frontend/src/examples.js";

const here = dirname(fileURLToPath(import.meta.url));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const ex of EXAMPLES) {
  const payload = { name: ex.name, data: ex.data };
  const file = join(here, `${slug(ex.name)}.json`);
  writeFileSync(file, JSON.stringify(payload, null, 2));
  console.log("wrote", file);
}
console.log(`\nDone: ${EXAMPLES.length} project files.`);
