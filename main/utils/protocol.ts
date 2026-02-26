import {protocol, net, app} from 'electron';
import path from 'node:path';

export const setupProtocol = () => {
  const rendererDir = path.join(app.getAppPath(), 'renderer', 'out');

  protocol.handle('file', request => {
    const url = new URL(request.url);
    const filePath = decodeURIComponent(url.pathname);

    // In production, remap /_next and /static paths to renderer/out/ directory
    // (replaces electron-next's adjustRenderer)
    if (app.isPackaged && (filePath.startsWith('/_next') || filePath.startsWith('/static'))) {
      const remappedPath = path.join(rendererDir, filePath);
      return net.fetch(`file://${remappedPath}`, {bypassCustomProtocolHandlers: true});
    }

    // Default: serve file normally
    return net.fetch(request.url, {bypassCustomProtocolHandlers: true});
  });
};
