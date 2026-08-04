"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const relativePath = "dist/assets/MainCanvasFlow-BbsMxxcM.js";
const marker = "Jiaren Agent image model failover v112";

function read() {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function write(source) {
  fs.writeFileSync(path.join(projectRoot, relativePath), source, "utf8");
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing ${label}.`);
  return source.replace(search, replacement);
}

let source = read();
if (source.includes(marker)) {
  console.log("Jiaren Agent image model failover patch already applied.");
  process.exit(0);
}

const functionStart = source.indexOf("  async function Pn() {");
const functionEnd = source.indexOf('\n  return o.jsxs("div", {', functionStart);
if (functionStart < 0 || functionEnd < 0) {
  throw new Error("Missing image generation function.");
}

let generation = source.slice(functionStart, functionEnd);
generation = replaceRequired(
  generation,
  "    if (!he.apiKey.trim()) {",
  "    if (!jiarenIsTransientAgentImage && !he.apiKey.trim()) {",
  "manual image API key validation",
);
generation = replaceRequired(
  generation,
  "    if (!he.baseUrl.trim()) {",
  "    if (!jiarenIsTransientAgentImage && !he.baseUrl.trim()) {",
  "manual image Base URL validation",
);

const failoverHelper = `    function jiarenAgentFailureKind(value) {
      const status = Number(value?.statusCode ?? value?.status ?? value?.response?.status);
      const message = value instanceof Error
        ? value.message
        : String(value?.message ?? value?.error ?? "");
      if (status === 429 || /rate.?limit|capacity|temporarily unavailable|model unavailable/i.test(message))
        return "busy";
      if (status >= 500 && status <= 599) return "upstream";
      if (!Array.isArray(value?.assets) || value.assets.length === 0) return "empty-assets";
      return "request-failed";
    }
    async function jiarenGenerateAgentImage(request) {
      if (!jiarenIsTransientAgentImage) return en.generateImage(request);
      const currentSettings = L.getState().runtimeSettings,
        enabledModels = currentSettings.models.filter(
          (model) => model.category === "image" && model.enabled,
        ),
        preferredModel = vn(currentSettings, "image"),
        seen = new Set(),
        candidates = [preferredModel, ...enabledModels]
          .filter((model) => {
            if (!model || seen.has(model.id)) return false;
            seen.add(model.id);
            return true;
          })
          .slice(0, 3);
      let lastFailure;
      for (let index = 0; index < candidates.length; index += 1) {
        const model = candidates[index],
          settings = Qn(currentSettings, model.id);
        if (!settings.apiKey.trim() || !settings.baseUrl.trim()) {
          console.info("[Jiaren Agent image failover]", {
            attempt: index + 1,
            total: candidates.length,
            outcome: "skipped",
            reason: "configuration",
          });
          continue;
        }
        try {
          const result = await en.generateImage({
            ...request,
            modelAlias: model.alias,
            modelId: model.id,
            endpointModelId:
              model.endpointModelId?.trim() || model.modelId || model.id,
            fallbackEndpointModelId: model.fallbackEndpointModelId,
            requestMode: model.requestMode,
            apiGroup: model.apiGroup,
            baseUrl: settings.baseUrl,
            apiKey: settings.apiKey,
            fallbackBaseUrl: settings.fallbackBaseUrl,
            fallbackApiKey: settings.fallbackApiKey,
          });
          if (
            (Array.isArray(result?.assets) && result.assets.length > 0) ||
            (result?.status === "queued" && result?.taskId)
          ) {
            console.info("[Jiaren Agent image failover]", {
              attempt: index + 1,
              total: candidates.length,
              outcome: "accepted",
            });
            return result;
          }
          lastFailure = result;
          console.info("[Jiaren Agent image failover]", {
            attempt: index + 1,
            total: candidates.length,
            outcome: "retry",
            reason: jiarenAgentFailureKind(result),
          });
        } catch (error) {
          lastFailure = error;
          console.info("[Jiaren Agent image failover]", {
            attempt: index + 1,
            total: candidates.length,
            outcome: "retry",
            reason: jiarenAgentFailureKind(error),
          });
        }
      }
      console.warn("[Jiaren Agent image failover]", {
        attempts: candidates.length,
        outcome: "failed",
        reason: jiarenAgentFailureKind(lastFailure),
      });
      return {
        id: crypto.randomUUID(),
        status: "failed",
        assets: [],
        message: "图片任务未完成，请检查当前图片接口配置后重试",
      };
    }
`;

generation = replaceRequired(
  generation,
  "    function $o(xe) {",
  `${failoverHelper}    function $o(xe) {`,
  "Agent image failover helper insertion point",
);
generation = replaceRequired(
  generation,
  "            Te = await en.generateImage({",
  "            Te = await jiarenGenerateAgentImage({",
  "Agent-aware image generation call",
);

source = source.slice(0, functionStart) + generation + source.slice(functionEnd);
source += `\n/* ${marker} */\n`;
write(source);
console.log("Jiaren Agent image model failover patch applied.");
