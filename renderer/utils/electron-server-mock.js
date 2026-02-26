// Mock electron module for Next.js server-side pre-rendering.
// During static export build, pages are pre-rendered in Node.js (not Electron),
// so electron APIs are not available. This provides no-op stubs.
const noop = () => {};

const ipcRenderer = {
  on: noop,
  once: noop,
  invoke: noop,
  send: noop,
  sendSync: noop,
  removeListener: noop,
  removeAllListeners: noop,
};

const shell = {
  openExternal: noop,
  openPath: noop,
};

const nativeImage = {
  createFromDataURL: () => ({resize: () => ({})}),
};

module.exports = {ipcRenderer, shell, nativeImage};
module.exports.default = module.exports;
