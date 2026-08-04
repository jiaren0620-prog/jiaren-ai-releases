const FORM_DEFINITIONS = [
  {
    id: "mirror",
    entityKind: "embodied-object",
    type: "object",
    aliases: [
      "\u955c\u5b50",
      "\u53e4\u955c",
      "\u5706\u955c",
      "\u94dc\u955c",
      "\u7075\u955c",
      "\u5b9d\u955c",
      "\u955c\u4f53",
      "\u955c\u9762",
    ],
    pattern: /\u955c\u5b50|\u53e4\u955c|\u5706\u955c|\u94dc\u955c|\u7075\u955c|\u5b9d\u955c|\u955c\u4f53|\u955c\u9762/i,
    label: "\u5706\u5f62\u7070\u9752\u8272\u955c\u5b50",
    appearance:
      "\u4e3b\u89d2\u5f53\u524d\u53ef\u89c1\u5f62\u6001\u662f\u4e00\u9762\u5706\u5f62\u7070\u9752\u8272\u955c\u5b50\uff0c\u955c\u9762\u53cd\u5149\uff0c\u4ec5\u53ef\u51fa\u73b0\u539f\u6587\u660e\u786e\u63d0\u5230\u7684\u5fae\u5f31\u6beb\u5149\u3002\u6750\u8d28\u3001\u82b1\u7eb9\u4e0e\u94ed\u6587\u672a\u5728\u539f\u6587\u4e2d\u786e\u5b9a\uff0c\u4e0d\u5f97\u64c5\u81ea\u6dfb\u52a0\u3002\u5f53\u524d\u5f62\u6001\u6ca1\u6709\u4eba\u4f53\u3001\u8138\u3001\u5934\u53d1\u3001\u670d\u88c5\u6216\u6b66\u5668\u3002",
    imagePrompt:
      "CURRENT VISIBLE FORM HARD LOCK: the protagonist is one round gray-green sentient mirror, a simple circular reflective object with only a subtle faint glow explicitly supported by the source. Material is unspecified. Do not invent ornate decoration, engraved writing, runes, a name plaque, or extra accessories. Isolated reusable protagonist-form asset on a clean neutral background. No human, no man, no woman, no swordsman, no body, no face, no hair, no clothes, no hands, no weapon, no second object, no scene background, no text, no watermark.",
    sheetPrompt:
      "Orthographic object identity sheet of the exact same round gray-green sentient mirror: front view, side profile, back view and top view, identical circular proportions and identical surface color in every view. Source-faithful simple form, material unspecified, subtle faint glow only. No human, no face, no limbs, no clothing, no weapon, no ornate fantasy redesign, no writing, no labels, no watermark.",
  },
  {
    id: "artifact",
    entityKind: "embodied-object",
    type: "object",
    aliases: [
      "\u7389\u4f69",
      "\u6212\u6307",
      "\u77f3\u5934",
      "\u96d5\u50cf",
      "\u73a9\u5076",
      "\u4e66",
      "\u5251",
      "\u5200",
      "\u6cd5\u5668",
      "\u5668\u7269",
    ],
    pattern: /\u7389\u4f69|\u6212\u6307|\u77f3\u5934|\u96d5\u50cf|\u73a9\u5076|\u4e66\u672c|\u53e4\u4e66|\u5b9d\u5251|\u957f\u5251|\u5200\u5251|\u6cd5\u5668|\u5668\u7269/i,
    label: "\u975e\u4eba\u5f62\u5668\u7269",
  },
  {
    id: "creature",
    entityKind: "embodied-creature",
    type: "entity",
    aliases: ["\u732b", "\u72d7", "\u9e1f", "\u9c7c", "\u9f99", "\u5996\u517d", "\u7075\u517d"],
    pattern: /\u732b|\u72d7|\u9e1f|\u9c7c|\u9f99|\u5996\u517d|\u7075\u517d|cat|dog|bird|fish|dragon|creature/i,
    label: "\u975e\u4eba\u5f62\u751f\u7269",
  },
  {
    id: "machine",
    entityKind: "embodied-machine",
    type: "entity",
    aliases: ["\u673a\u5668\u4eba", "\u673a\u7532", "\u6c7d\u8f66", "\u6469\u6258\u8f66", "\u98de\u8239"],
    pattern: /\u673a\u5668\u4eba|\u673a\u7532|\u6c7d\u8f66|\u6469\u6258\u8f66|\u98de\u8239|robot|android|mecha|vehicle|car|motorcycle|spaceship/i,
    label: "\u975e\u4eba\u5f62\u673a\u68b0\u4f53",
  },
];

const FORM_CUE_PATTERN =
  /\u53d8\u6210|\u6210\u4e3a|\u6210\u4e86|\u5316\u4f5c|\u8f6c\u751f\u4e3a|\u8f6c\u751f\u6210|\u9b42\u7a7f\u4e3a|\u9b42\u7a7f\u6210|\u7a7f\u8d8a\u6210|\u9644\u8eab\u4e8e|\u9644\u8eab\u5230|\u5f53\u524d\u5f62\u6001|\u73b0\u5728\u7684\u6211|\u8fd9\u4fbf\u662f\u73b0\u5728\u7684\u6211|\u6211\u4e0d\u505a\u4eba\u4e86|\u5668\u7075/i;

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function matchPositions(text, pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  const positions = [];
  let match;
  while ((match = matcher.exec(text))) {
    positions.push(match.index);
    if (!match[0]) matcher.lastIndex += 1;
  }
  return positions;
}

function hasNearbyFormCue(text, definition) {
  const cuePositions = matchPositions(text, FORM_CUE_PATTERN);
  const formPositions = matchPositions(text, definition.pattern);
  return cuePositions.some((cue) => formPositions.some((form) => Math.abs(cue - form) <= 180));
}

function genericAppearance(name, definition) {
  return `${name}\u7684\u5f53\u524d\u53ef\u89c1\u5f62\u6001\u662f${definition.label}\u3002\u53ea\u4fdd\u7559\u539f\u6587\u660e\u786e\u63d0\u4f9b\u7684\u8f6e\u5ed3\u3001\u6bd4\u4f8b\u3001\u6750\u8d28\u3001\u989c\u8272\u548c\u635f\u8017\u4fe1\u606f\uff1b\u539f\u6587\u672a\u8bf4\u660e\u7684\u7ec6\u8282\u4e0d\u5f97\u64c5\u81ea\u8865\u5168\u3002\u4e0d\u5f97\u5c06\u5176\u8bbe\u8ba1\u6210\u4eba\u5f62\u89d2\u8272\u3002`;
}

function genericImagePrompt(definition) {
  return `CURRENT VISIBLE FORM HARD LOCK: the protagonist currently exists as ${definition.label}, not as a human actor. Preserve only source-confirmed silhouette, proportions, colors, materials and wear. Isolated reusable protagonist-form reference on a clean neutral background. No human, no humanoid redesign, no man, no woman, no face, no hair, no clothing, no hands, no unrelated weapon, no second subject, no scene background, no text, no watermark.`;
}

function genericSheetPrompt(definition) {
  return `Orthographic identity sheet of the exact same ${definition.label}: front, side, back and top views with identical proportions, colors and source-confirmed details. No human or humanoid redesign, no alternate form, no labels, no text, no watermark.`;
}

export function JiarenDetectEmbodiedProtagonistAsset(source = "", script = "", name = "") {
  const text = compact(`${source}\n${script}`);
  if (!text || !FORM_CUE_PATTERN.test(text)) return null;
  const definition = FORM_DEFINITIONS.find(
    (candidate) => candidate.pattern.test(text) && hasNearbyFormCue(text, candidate),
  );
  if (!definition) return null;

  const protagonistName = compact(name) || "\u4e3b\u89d2";
  const appearance = definition.appearance || genericAppearance(protagonistName, definition);
  const imagePrompt = definition.imagePrompt || genericImagePrompt(definition);
  const sheetPrompt = definition.sheetPrompt || genericSheetPrompt(definition);
  return {
    name: protagonistName,
    formId: definition.id,
    entityKind: definition.entityKind,
    type: definition.type,
    aliases: definition.aliases,
    description: `${protagonistName}\u662f\u6545\u4e8b\u7684\u4e3b\u89d2\uff0c\u4f46\u5f53\u524d\u753b\u9762\u4e2d\u5fc5\u987b\u4ee5${definition.label}\u51fa\u73b0\u3002\u4eba\u7c7b\u8eab\u4efd\u53ea\u662f\u80cc\u666f\u4fe1\u606f\uff0c\u539f\u6587\u6ca1\u6709\u660e\u786e\u4eba\u5f62\u5916\u8c8c\u65f6\u4e0d\u5f97\u751f\u6210\u4eba\u7269\u5b9a\u5986\u7167\u3002`,
    appearance,
    imagePrompt,
    sheetPrompt,
    agentInstruction: [
      "EMBODIED PROTAGONIST HARD LOCK:",
      `${protagonistName} currently appears as ${definition.label}, not as a visible human actor.`,
      "Return this protagonist in characters[] as a non-human embodied identity asset with entity_kind, appearance, image_prompt and sheet_prompt.",
      "Do not create a speculative human portrait from the character name, occupation, former life, dialogue or narration.",
      "Do not duplicate the embodied protagonist in props[] or objects[].",
      imagePrompt,
    ].join("\n"),
  };
}

export function JiarenMatchesEmbodiedProtagonistAsset(asset, lock) {
  if (!asset || !lock) return false;
  const text = compact(
    [asset.name, asset.title, asset.description, asset.appearance, asset.prompt, asset.type].filter(Boolean).join(" "),
  );
  if (!text) return false;
  return lock.aliases.some((alias) => text.includes(alias));
}
