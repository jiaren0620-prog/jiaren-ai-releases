'use strict';

async function runLocalHooks(_event, payload = {}) {
  return { ...payload, handled: false };
}

module.exports = { runLocalHooks };
