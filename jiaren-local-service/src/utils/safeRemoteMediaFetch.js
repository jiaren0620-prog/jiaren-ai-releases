'use strict';

const dns = require('dns').promises;
const http = require('http');
const https = require('https');
const net = require('net');

function normalizeAddress(value) {
  let text = String(value || '').trim().toLowerCase();
  if (text.startsWith('[') && text.endsWith(']')) text = text.slice(1, -1);
  return text.startsWith('::ffff:') ? text.slice(7) : text;
}

function isLoopbackAddress(value) {
  const address = normalizeAddress(value);
  return address === '::1' || address === 'localhost' || /^127(?:\.\d{1,3}){3}$/.test(address);
}

function isPrivateAddress(value) {
  const address = normalizeAddress(value);
  if (!address || isLoopbackAddress(address)) return true;
  if (net.isIPv4(address)) {
    const parts = address.split('.').map(Number);
    return parts[0] === 0 || parts[0] === 10 || parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] >= 224;
  }
  if (net.isIPv6(address)) {
    return address === '::' || address === '::1' || /^f[cd]/.test(address) || /^fe[89ab]/.test(address);
  }
  return true;
}

async function resolvePublicAddress(hostname, lookupImpl = dns.lookup, allowPrivateForTests = false) {
  const records = await lookupImpl(normalizeAddress(hostname), { all: true, verbatim: true });
  if (!records.length || (!allowPrivateForTests && records.some((record) => isPrivateAddress(record.address)))) {
    throw Object.assign(new Error('远程地址解析到本机或私有网络，已拒绝访问。'), { code: 'private_address' });
  }
  return records[0];
}

function readLimitedResponse(response, maxBytes) {
  return new Promise((resolve, reject) => {
    const declared = Number(response.headers['content-length'] || 0);
    if (declared > maxBytes) {
      response.destroy();
      reject(Object.assign(new Error(`远程资源超过 ${Math.round(maxBytes / 1024 / 1024)}MB 限制。`), { code: 'item_too_large' }));
      return;
    }
    const chunks = [];
    let total = 0;
    response.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        response.destroy(Object.assign(new Error(`远程资源超过 ${Math.round(maxBytes / 1024 / 1024)}MB 限制。`), { code: 'item_too_large' }));
        return;
      }
      chunks.push(chunk);
    });
    response.on('end', () => resolve(Buffer.concat(chunks)));
    response.on('error', reject);
  });
}

async function safeRemoteMediaFetch(inputUrl, options = {}, redirectCount = 0) {
  const maxRedirects = Number.isFinite(options.maxRedirects) ? options.maxRedirects : 4;
  const maxBytes = Number(options.maxBytes) || 30 * 1024 * 1024;
  const timeoutMs = Number(options.timeoutMs) || 30_000;
  if (redirectCount > maxRedirects) throw Object.assign(new Error('远程资源重定向次数过多。'), { code: 'too_many_redirects' });
  const target = new URL(String(inputUrl || ''));
  if (!['http:', 'https:'].includes(target.protocol)) throw Object.assign(new Error('只支持 HTTP/HTTPS 远程地址。'), { code: 'invalid_protocol' });
  const pinned = await resolvePublicAddress(target.hostname, options.lookupImpl || dns.lookup, options.allowPrivateForTests === true);
  const transport = target.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const request = transport.get(target, {
      headers: {
        Accept: options.accept || '*/*',
        'User-Agent': options.userAgent || 'JiarenAI/1.0',
        ...(options.headers || {}),
      },
      lookup(_hostname, _lookupOptions, callback) {
        callback(null, pinned.address, pinned.family);
      },
    }, async (response) => {
      const status = Number(response.statusCode || 0);
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume();
        try {
          resolve(await safeRemoteMediaFetch(new URL(response.headers.location, target).toString(), options, redirectCount + 1));
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        reject(Object.assign(new Error(`远程资源返回 HTTP ${status}。`), { code: 'remote_http_error' }));
        return;
      }
      try {
        const buffer = await readLimitedResponse(response, maxBytes);
        resolve({
          buffer,
          contentType: String(response.headers['content-type'] || ''),
          finalUrl: target.toString(),
          status,
        });
      } catch (error) {
        reject(error);
      }
    });
    request.setTimeout(timeoutMs, () => request.destroy(Object.assign(new Error('远程资源读取超时。'), { code: 'fetch_timeout' })));
    request.on('error', reject);
  });
}

module.exports = {
  isLoopbackAddress,
  isPrivateAddress,
  normalizeAddress,
  resolvePublicAddress,
  safeRemoteMediaFetch,
};
