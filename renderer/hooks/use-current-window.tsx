const remote = require('utils/electron-remote') as typeof import('@electron/remote');

export const useCurrentWindow = () => {
  return remote.getCurrentWindow();
};
