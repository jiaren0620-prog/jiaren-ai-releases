'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  CODEX_INSTALL_COMMAND,
  normalizeCodexAuthStatusForTests,
  resolveCodexExecutable,
  startCodexLogin,
} = require('../jiaren-local-service/src/utils/codexCliRunner');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jiaren-codex-login-'));
try {
  const appData = path.join(root, 'AppData', 'Roaming');
  const npmDir = path.join(appData, 'npm');
  const npmCodex = path.join(npmDir, 'codex.cmd');
  const windowsAppsDir = path.join(root, 'WindowsApps', 'OpenAI.Codex', 'app', 'resources');
  const desktopCodex = path.join(windowsAppsDir, 'codex.exe');
  fs.mkdirSync(npmDir, { recursive: true });
  fs.mkdirSync(windowsAppsDir, { recursive: true });
  fs.writeFileSync(npmCodex, '@echo off\r\n', 'utf8');
  fs.writeFileSync(desktopCodex, '', 'utf8');

  const env = {
    APPDATA: appData,
    USERPROFILE: root,
    PATH: windowsAppsDir,
  };
  const npmResolved = resolveCodexExecutable({ executablePath: 'codex', env, platform: 'win32' });
  assert.equal(npmResolved.usable, true);
  assert.equal(npmResolved.fromWindowsApps, false);
  assert.equal(path.normalize(npmResolved.executable), path.normalize(npmCodex));
  assert.deepEqual(npmResolved.rejectedWindowsApps.map(path.normalize), [path.normalize(desktopCodex)]);

  fs.unlinkSync(npmCodex);
  const desktopOnly = resolveCodexExecutable({ executablePath: 'codex', env, platform: 'win32' });
  assert.equal(desktopOnly.usable, false);
  assert.equal(desktopOnly.fromWindowsApps, true);
  assert.equal(desktopOnly.candidates.length, 0);

  const rejectedLogin = startCodexLogin({ executablePath: desktopCodex, env, platform: 'win32' });
  assert.equal(rejectedLogin.started, false);
  assert.equal(rejectedLogin.code, 'codex_desktop_is_not_cli');
  assert.equal(rejectedLogin.installCommand, CODEX_INSTALL_COMMAND);
  assert.match(rejectedLogin.message, /桌面应用/);

  fs.writeFileSync(npmCodex, '@echo off\r\n', 'utf8');
  let spawnCall;
  const launched = startCodexLogin({
    executablePath: npmCodex,
    env,
    platform: 'win32',
    writeLoginScript: () => path.join(root, 'Codex Login', 'open-codex-login.cmd'),
    spawnImpl(command, args, options) {
      spawnCall = { command, args, options };
      return { unref() {} };
    },
  });
  assert.equal(launched.started, true);
  assert.equal(launched.mode, 'visible-terminal');
  assert.equal(spawnCall.command, 'cmd.exe');
  assert.deepEqual(spawnCall.args, ['/d', '/k', path.join(root, 'Codex Login', 'open-codex-login.cmd')]);
  assert.equal(spawnCall.args.includes('start'), false);
  assert.equal(spawnCall.options.windowsHide, false);
  assert.equal(normalizeCodexAuthStatusForTests('Logged in using an API key - sk-example***tail'), '已通过 API Key 登录');
  assert.equal(normalizeCodexAuthStatusForTests('Logged in using ChatGPT'), '已通过 OpenAI 账号登录');
  assert.equal(normalizeCodexAuthStatusForTests('Custom auth sk-secret123'), 'Custom auth [已隐藏]');

  console.log(JSON.stringify({
    npmResolved: npmResolved.executable,
    rejectedDesktopEntry: desktopOnly.rejectedWindowsApps[0],
    loginArgs: spawnCall.args,
    installCommand: CODEX_INSTALL_COMMAND,
  }, null, 2));
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
