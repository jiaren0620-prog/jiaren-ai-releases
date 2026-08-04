import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error("JIAREN_QA_RUNTIME is required");

const exePath = path.join(runtimeDir, "Jiaren AI.exe");
const port = Number(process.env.JIAREN_QA_PORT || 9393);
const profileDir = path.join(runtimeDir, `qa-profile-transparent-${Date.now()}-${process.pid}`);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(250);
  }
  throw new Error("Jiaren AI CDP page target not found");
}

const sourceSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <rect width="256" height="256" fill="#ffffff"/>
    <rect x="58" y="54" width="140" height="154" rx="34" fill="#245b3a"/>
    <circle cx="100" cy="112" r="15" fill="#c7ff3d"/>
    <circle cx="156" cy="112" r="15" fill="#c7ff3d"/>
  </svg>
`);
const sourcePng = await sharp(sourceSvg).png().toBuffer();
const sourceDataUrl = `data:image/png;base64,${sourcePng.toString("base64")}`;

await fs.mkdir(profileDir, { recursive: true });
const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
], { cwd: runtimeDir, stdio: "ignore" });

let socket;
try {
  const target = await findTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };

  await send("Runtime.enable");
  const readyDeadline = Date.now() + 20000;
  while (Date.now() < readyDeadline) {
    if (await evaluate("Boolean(window.jiaren?.runtime?.removeBackground)")) break;
    await pause(200);
  }

  const result = await evaluate(`(async () => {
    const response = await window.jiaren.runtime.removeBackground({
      source: ${JSON.stringify(sourceDataUrl)},
      modelKey: "background-removal",
      outputFormat: "png",
      crop: false,
      border: 0,
    });
    const asset = response?.assets?.[0];
    if (!asset?.dataUrl) return { status: response?.status, message: response?.message, asset: null };
    const image = new Image();
    image.src = asset.dataUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let minAlpha = 255;
    let transparentPixels = 0;
    let opaquePixels = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      minAlpha = Math.min(minAlpha, pixels[index]);
      if (pixels[index] < 250) transparentPixels += 1;
      if (pixels[index] === 255) opaquePixels += 1;
    }
    return {
      status: response.status,
      message: response.message,
      mimeType: asset.mimeType || asset.dataUrl.slice(5, asset.dataUrl.indexOf(";")),
      width: canvas.width,
      height: canvas.height,
      minAlpha,
      transparentPixels,
      opaquePixels,
    };
  })()`);

  if (result?.status !== "succeeded") throw new Error(result?.message || "Background removal failed");
  if (result?.mimeType !== "image/png") throw new Error(`Expected image/png, received ${result?.mimeType}`);
  if (!(result?.minAlpha < 250) || !(result?.transparentPixels > 0)) {
    throw new Error(`Output does not contain transparent pixels: ${JSON.stringify(result)}`);
  }
  if (!(result?.opaquePixels > 0)) throw new Error("Output lost the opaque subject");

  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(700);
  await fs.rm(profileDir, { recursive: true, force: true });
}
