"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const assetsRoot = path.join(projectRoot, "dist", "assets");
const bundleName = fs.readdirSync(assetsRoot).find((name) => /^jiaren-canvas-.*\.js$/i.test(name));

if (!bundleName) {
  throw new Error("Cannot locate the Jiaren canvas bundle.");
}

const bundlePath = path.join(assetsRoot, bundleName);
let source = fs.readFileSync(bundlePath, "utf8");
const hydrationMarker = "const g = c ? r : ji(r)";
const refreshMarker = 'String(U.providerSource || "").startsWith("jiaren-channel:")';

if (!source.includes(hydrationMarker)) {
  const original = `  for (const r of e) {
    if (Ui(r) || !Wa(r) || !pn(r.baseUrl, a)) continue;
    const c = ji(r),
      g = \`${'${c.category}:${c.endpointModelId || c.modelId}:${c.baseUrl || ""}'}\`;
    d.has(g) || (d.add(g), o.push(c));
  }`;
  const replacement = `  for (const r of e) {
    const c =
      String(r.providerSource || "").startsWith("jiaren-channel:") ||
      r.id.startsWith("provider-channel-");
    if (Ui(r) || !Wa(r) || (!c && !pn(r.baseUrl, a))) continue;
    const g = c ? r : ji(r),
      b = \`${'${g.category}:${g.endpointModelId || g.modelId}:${g.baseUrl || ""}'}\`;
    d.has(b) || (d.add(b), o.push(g));
  }`;
  if (!source.includes(original)) throw new Error("Channel hydration marker was not found.");
  source = source.replace(original, replacement);
}

if (!source.includes(refreshMarker)) {
  const original = "        const d = o.runtimeSettings.models.filter(Ui),";
  const replacement = `        const d = o.runtimeSettings.models.filter(
            (U) =>
              Ui(U) ||
              String(U.providerSource || "").startsWith("jiaren-channel:") ||
              U.id.startsWith("provider-channel-"),
          ),`;
  if (!source.includes(original)) throw new Error("Provider refresh marker was not found.");
  source = source.replace(original, replacement);
}

fs.writeFileSync(bundlePath, source, "utf8");

console.log(`Jiaren channel model persistence patch verified: ${bundleName}`);
