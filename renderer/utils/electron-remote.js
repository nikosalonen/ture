// Safe import of @electron/remote for SSR compatibility.
// During Next.js SSR/build, code runs outside Electron where
// @electron/remote is not available (it requires Electron native bindings).
let remote;
try {
  remote = require('@electron/remote');
} catch {
  remote = undefined;
}

module.exports = remote;
