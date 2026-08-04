"use strict";

const dns = require("node:dns");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const path = require("node:path");
const { Transform } = require("node:stream");
const { pipeline } = require("node:stream/promises");

const PUBLIC_DNS = Object.freeze(["223.5.5.5", "1.1.1.1", "8.8.8.8"]);
const DOH_ENDPOINTS = Object.freeze([
  "https://dns.alidns.com/resolve",
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/resolve",
]);

function isFakeIp(value) {
  const parts = String(value || "").split(".").map(Number);
  return parts.length === 4 && parts.every((item) => Number.isInteger(item) && item >= 0 && item <= 255) && parts[0] === 198 && (parts[1] === 18 || parts[1] === 19);
}

function isPrivateIp(value) {
  const ip = String(value || "").replace(/^::ffff:/, "");
  if (net.isIP(ip) === 6) return ip === "::1" || /^f[cd]/i.test(ip) || /^fe[89ab]/i.test(ip);
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return true;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || parts[0] === 169 && parts[1] === 254 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31 || parts[0] === 192 && parts[1] === 168 || parts[0] >= 224;
}

function publicAddress(records) {
  return records.find((item) => {
    const address = typeof item === "string" ? item : item?.address;
    return net.isIP(address) && !isPrivateIp(address) && !isFakeIp(address);
  });
}

function resolveSystem(hostname) {
  return dns.promises.lookup(hostname, { all: true, verbatim: true });
}

async function resolvePublicDns(hostname) {
  for (const server of PUBLIC_DNS) {
    const resolver = new dns.promises.Resolver();
    resolver.setServers([server]);
    try {
      const records = [
        ...(await resolver.resolve4(hostname).catch(() => [])).map((address) => ({ address, family: 4 })),
        ...(await resolver.resolve6(hostname).catch(() => [])).map((address) => ({ address, family: 6 })),
      ];
      const selected = publicAddress(records);
      if (selected) return selected;
    } catch {}
  }
  for (const endpoint of DOH_ENDPOINTS) {
    try {
      const url = new URL(endpoint);
      url.searchParams.set("name", hostname);
      url.searchParams.set("type", "A");
      const response = await fetch(url, { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(4000) });
      if (!response.ok) continue;
      const payload = await response.json();
      const selected = publicAddress((payload.Answer || []).map((item) => ({ address: item.data, family: net.isIP(item.data) })));
      if (selected) return selected;
    } catch {}
  }
  throw new Error(`无法通过公共 DNS 解析 ${hostname}。`);
}

async function resolveDownloadAddress(hostname, allowCurrentRoute = true, allowPrivate = false) {
  const systemRecords = await resolveSystem(hostname).catch(() => []);
  const current = systemRecords.find((item) => net.isIP(item.address) && (allowPrivate || !isPrivateIp(item.address)));
  if (allowCurrentRoute && current) return { ...current, fakeIp: isFakeIp(current.address), source: isFakeIp(current.address) ? "vpn-fake-ip" : "system" };
  if (allowPrivate && current) return { ...current, fakeIp: isFakeIp(current.address), source: "system" };
  const selected = publicAddress(systemRecords);
  if (selected) return { ...selected, fakeIp: false, source: "system" };
  const fallback = await resolvePublicDns(hostname);
  return { ...fallback, fakeIp: false, source: "public-dns" };
}

function requestOnce(target, address, options) {
  return new Promise((resolve, reject) => {
    const client = target.protocol === "https:" ? https : http;
    const request = client.request({
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || undefined,
      path: `${target.pathname}${target.search}`,
      method: "GET",
      headers: { Accept: options.accept || "*/*", "User-Agent": "JiarenAI/1.0", ...(options.headers || {}) },
      servername: target.hostname,
      lookup: (_hostname, lookupOptions, callback) => {
        const family = Number(address.family) || net.isIP(address.address);
        if (lookupOptions?.all) {
          callback(null, [{ address: address.address, family }]);
          return;
        }
        callback(null, address.address, family);
      },
      timeout: options.timeoutMs || 30000,
      signal: options.signal,
    }, resolve);
    request.once("timeout", () => request.destroy(new Error("下载连接超时。")));
    request.once("error", reject);
    request.end();
  });
}

async function openResponse(inputUrl, options = {}) {
  let currentUrl = String(inputUrl || "");
  const visited = new Set();
  for (let redirect = 0; redirect <= (options.maxRedirects ?? 5); redirect += 1) {
    const target = new URL(currentUrl);
    if (!/^https?:$/.test(target.protocol) || target.username || target.password) throw new Error("下载地址无效。")
    const literalHost = target.hostname.replace(/^\[|\]$/g, "");
    if (!options.allowPrivate && net.isIP(literalHost) && (isPrivateIp(literalHost) || isFakeIp(literalHost))) {
      throw new Error("下载地址不能使用本机、内网或 Fake-IP 字面量。");
    }
    if (visited.has(target.toString())) throw new Error("下载地址发生循环重定向。")
    visited.add(target.toString());
    let address = net.isIP(literalHost) && options.allowPrivate
      ? { address: literalHost, family: net.isIP(literalHost), fakeIp: isFakeIp(literalHost), source: "explicit-private" }
      : await resolveDownloadAddress(target.hostname, true, options.allowPrivate === true);
    let response;
    try {
      response = await requestOnce(target, address, options);
    } catch (error) {
      if (options.signal?.aborted) throw error;
      if (options.allowPrivate && (address.source === "explicit-private" || isPrivateIp(address.address))) throw error;
      const fallback = await resolvePublicDns(target.hostname);
      address = { ...fallback, fakeIp: false, source: "public-dns" };
      response = await requestOnce(target, address, options);
    }
    const status = Number(response.statusCode || 0);
    if (status >= 300 && status < 400 && response.headers.location) {
      response.resume();
      currentUrl = new URL(String(response.headers.location), target).toString();
      continue;
    }
    if (status < 200 || status >= 300) {
      response.resume();
      throw new Error(`下载失败：HTTP ${status}`);
    }
    return { response, finalUrl: target.toString(), source: address.source };
  }
  throw new Error("下载重定向次数过多。")
}

async function consume(response, maxBytes) {
  const length = Number(response.headers["content-length"] || 0);
  if (length > maxBytes) {
    response.destroy();
    throw new Error(`下载文件超过 ${maxBytes} 字节限制。`);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of response) {
    size += chunk.length;
    if (size > maxBytes) {
      response.destroy();
      throw new Error(`下载文件超过 ${maxBytes} 字节限制。`);
    }
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks, size);
}

async function downloadBuffer(inputUrl, options = {}) {
  const opened = await openResponse(inputUrl, options);
  const buffer = await consume(opened.response, options.maxBytes || 512 * 1024 * 1024);
  return {
    buffer,
    contentType: String(opened.response.headers["content-type"] || ""),
    finalUrl: opened.finalUrl,
    networkSource: opened.source,
  };
}

async function downloadFile(inputUrl, targetPath, options = {}) {
  const directory = path.dirname(targetPath);
  fs.mkdirSync(directory, { recursive: true });
  const temporaryPath = `${targetPath}.${process.pid}.part`;
  try {
    const opened = await openResponse(inputUrl, options);
    const maxBytes = options.maxBytes || 512 * 1024 * 1024;
    const contentLength = Number(opened.response.headers["content-length"] || 0);
    if (contentLength > maxBytes) {
      opened.response.destroy();
      throw new Error(`下载文件超过 ${maxBytes} 字节限制。`);
    }
    let byteSize = 0;
    let lastProgressAt = 0;
    const reportProgress = (force = false) => {
      if (typeof options.onProgress !== "function") return;
      const now = Date.now();
      if (!force && now - lastProgressAt < 250) return;
      lastProgressAt = now;
      try {
        options.onProgress({
          downloadedBytes: byteSize,
          totalBytes: contentLength,
        });
      } catch {}
    };
    const limiter = new Transform({
      transform(chunk, _encoding, callback) {
        byteSize += chunk.length;
        if (byteSize > maxBytes) {
          callback(new Error(`下载文件超过 ${maxBytes} 字节限制。`));
          return;
        }
        reportProgress();
        callback(null, chunk);
      },
    });
    await pipeline(opened.response, limiter, fs.createWriteStream(temporaryPath, { flags: "wx" }));
    reportProgress(true);
    fs.renameSync(temporaryPath, targetPath);
    return {
      path: targetPath,
      byteSize,
      contentType: String(opened.response.headers["content-type"] || ""),
      finalUrl: opened.finalUrl,
      networkSource: opened.source,
    };
  } catch (error) {
    try { fs.unlinkSync(temporaryPath); } catch {}
    throw error;
  }
}

module.exports = {
  downloadBuffer,
  downloadFile,
  isFakeIp,
  isPrivateIp,
  resolveDownloadAddress,
};
