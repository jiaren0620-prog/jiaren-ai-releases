function referenceUrl(reference) {
  if (typeof reference === "string") return reference;
  return reference?.dataUrl || reference?.url || "";
}

function referenceForPart(part, references) {
  if (Number.isInteger(part?.referenceIndex)) {
    return {
      index: part.referenceIndex,
      reference: references[part.referenceIndex],
    };
  }
  const key = String(part?.referenceKey || "");
  if (!key) return { index: -1, reference: void 0 };
  const index = references.findIndex((reference) =>
    String(reference?.referenceKey || "") === key,
  );
  return { index, reference: references[index] };
}

function appendText(parts, text) {
  const value = String(text || "");
  if (!value) return;
  const previous = parts[parts.length - 1];
  if (previous?.type === "text") previous.text += value;
  else parts.push({ type: "text", text: value });
}

function normalizeOrderedMultimodalContent(request, references = []) {
  const source = Array.isArray(request?.multimodalContent)
    ? request.multimodalContent
    : [];
  const prompt = String(request?.prompt || "");
  if (source.length === 0) {
    return [
      ...(prompt ? [{ type: "text", text: prompt }] : []),
      ...references.map((reference, referenceIndex) => ({
        type: "image",
        reference,
        referenceIndex,
      })),
    ];
  }

  const parts = [];
  const used = new Set();
  for (const part of source) {
    if (part?.type === "text") {
      appendText(parts, part.text);
      continue;
    }
    if (part?.type !== "image") continue;
    const resolved = referenceForPart(part, references);
    if (!resolved.reference || resolved.index < 0 || used.has(resolved.index)) continue;
    used.add(resolved.index);
    parts.push({
      type: "image",
      reference: resolved.reference,
      referenceIndex: resolved.index,
    });
  }

  references.forEach((reference, referenceIndex) => {
    if (used.has(referenceIndex)) return;
    used.add(referenceIndex);
    parts.push({ type: "image", reference, referenceIndex });
  });

  const inlineText = parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
  if (prompt.trim() && prompt.trim() !== inlineText) {
    appendText(parts, `${parts.length ? "\n\n" : ""}全局生成要求：${prompt}`);
  }
  return parts;
}

function buildOrderedOpenAIImageContent(request, references = []) {
  return normalizeOrderedMultimodalContent(request, references).flatMap((part) => {
    if (part.type === "text") return [{ type: "text", text: part.text }];
    const url = referenceUrl(part.reference);
    return url ? [{ type: "image_url", image_url: { url } }] : [];
  });
}

function buildOrderedGeminiImageParts(request, references = []) {
  return normalizeOrderedMultimodalContent(request, references).flatMap((part) => {
    if (part.type === "text") return [{ text: part.text }];
    const reference = part.reference;
    if (!reference?.bytes) return [];
    return [{
      inline_data: {
        mime_type: reference.mime || "image/png",
        data: reference.bytes.toString("base64"),
      },
    }];
  });
}

function buildOrderedImagePrompt(request, references = []) {
  return normalizeOrderedMultimodalContent(request, references)
    .map((part) =>
      part.type === "text"
        ? part.text
        : `\n[参考图${part.referenceIndex + 1}]\n`,
    )
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

module.exports = {
  buildOrderedGeminiImageParts,
  buildOrderedImagePrompt,
  buildOrderedOpenAIImageContent,
  normalizeOrderedMultimodalContent,
};
