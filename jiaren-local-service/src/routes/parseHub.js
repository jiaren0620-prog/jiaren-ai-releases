'use strict';

const path = require('path');
const express = require('express');
const config = require('../config');
const {
  COMPLIANCE_WARNING,
  SUPPORTED_PLATFORM_HINTS,
  classifyParseHubError,
  getParseHubStatus,
  normalizeOptionalSecret,
  normalizeParseHubResult,
  normalizeResolveInput,
  runParseHubBridge,
} = require('../utils/parseHubBridge');

const router = express.Router();

function normalizeMode(value) {
  const text = String(value || '').trim().toLowerCase();
  return text === 'parse' ? 'parse' : 'download';
}

router.get('/status', async (_req, res) => {
  const data = await getParseHubStatus();
  res.json({ success: true, data });
});

router.get('/platforms', (_req, res) => {
  res.json({
    success: true,
    data: {
      platforms: SUPPORTED_PLATFORM_HINTS,
      complianceWarning: COMPLIANCE_WARNING,
    },
  });
});

router.post('/resolve', async (req, res) => {
  try {
    if (req.body?.acceptedCompliance !== true) {
      return res.status(400).json({
        success: false,
        code: 'compliance_required',
        error: '请先确认内容来源合法、已获授权，并同意合规使用提醒',
        complianceWarning: COMPLIANCE_WARNING,
      });
    }

    const input = normalizeResolveInput(req.body?.input || req.body?.url || req.body?.shareText);
    const proxy = normalizeOptionalSecret(req.body?.proxy, 512, '代理地址');
    const cookie = normalizeOptionalSecret(req.body?.cookie, 12000, 'Cookie');
    const mode = normalizeMode(req.body?.mode);
    const downloadPath = path.join(config.OUTPUT_DIR, 'parsehub');

    const payload = await runParseHubBridge({
      action: mode,
      input,
      proxy: proxy || undefined,
      cookie: cookie || undefined,
      downloadPath,
      saveMetadata: true,
    }, {
      timeoutMs: mode === 'download' ? 10 * 60 * 1000 : 90 * 1000,
    });

    const data = normalizeParseHubResult(payload);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    const message = err?.message || String(err);
    const classified = classifyParseHubError(err);
    res.status(classified.status).json({
      success: false,
      code: classified.code,
      error: message,
      hint: classified.hint,
      nextAction: classified.nextAction,
      complianceWarning: COMPLIANCE_WARNING,
    });
  }
});

module.exports = router;
