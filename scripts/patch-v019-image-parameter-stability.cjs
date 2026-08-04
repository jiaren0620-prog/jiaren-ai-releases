"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const targetPath = path.join(projectRoot, "dist", "assets", "MainCanvasFlow-BbsMxxcM.js");
const marker = "// Jiaren v0.1.9 image parameter stability";

let source = fs.readFileSync(targetPath, "utf8");
if (source.includes(marker)) {
  console.log("Image parameter stability patch is already applied.");
  process.exit(0);
}

function replaceOnce(pattern, replacement, label) {
  const matches = source.match(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`));
  if (!matches || matches.length !== 1) {
    throw new Error(`${label}: expected one match, found ${matches?.length ?? 0}`);
  }
  source = source.replace(pattern, replacement);
}

replaceOnce(
  /    A\.useEffect\(\(\) => \{\r?\n      if \(\r?\n        !x \|\|[\s\S]*?\r?\n    \}, \[x, \$e, oe, N, ve, S\]\),\r?\n/,
  `    ${marker}\n`,
  "conflicting local-to-node synchronization effect",
);

replaceOnce(
  /onClick: \(\) => \{\r?\n\s*\(de\(M\), Le\(void 0\)\);\r?\n\s*\},/,
  `onClick: () => {\n                            (de(M),\n                              S(Me.id, {\n                                resolution: M,\n                                sizeLabel: \`\${oe} \\u00b7 \${M}\`,\n                              }),\n                              Le(void 0));\n                          },`,
  "resolution click handler",
);

replaceOnce(
  /onClick: \(\) => \{\r?\n\s*\(Se\(M\), Le\(void 0\)\);\r?\n\s*\},/,
  `onClick: () => {\n                            (Se(M),\n                              S(Me.id, {\n                                aspectRatio: M,\n                                sizeLabel: \`\${M} \\u00b7 \${N}\`,\n                              }),\n                              Le(void 0));\n                          },`,
  "aspect-ratio click handler",
);

replaceOnce(
  /onClick: \(\) => \{\r?\n\s*\(ze\(M\), Le\(void 0\)\);\r?\n\s*\},/,
  `onClick: () => {\n                                (ze(M), S(Me.id, { quality: M }), Le(void 0));\n                              },`,
  "quality click handler",
);

fs.writeFileSync(targetPath, source, "utf8");
console.log("Patched image parameter selection to use one-way node updates.");
