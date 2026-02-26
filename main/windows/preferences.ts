import {BrowserWindow, ipcMain} from 'electron';
import {enable as enableRemote} from '@electron/remote/main';
import pEvent from 'p-event';

import {loadRoute} from '../utils/routes';
import {track} from '../common/analytics';
import {windowManager} from './manager';

let prefsWindow: BrowserWindow | undefined;

export type PreferencesWindowOptions = any;

const openPrefsWindow = async (options?: PreferencesWindowOptions) => {
  track('preferences/opened');
  windowManager.cropper?.close();

  if (prefsWindow) {
    if (options) {
      prefsWindow.webContents.send('options', options);
    }

    prefsWindow.show();
    return prefsWindow;
  }

  prefsWindow = new BrowserWindow({
    title: 'Preferences',
    width: 480,
    height: 480,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    show: false,
    frame: false,
    transparent: true,
    vibrancy: 'under-window',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  enableRemote(prefsWindow.webContents);

  const titlebarHeight = 85;
  prefsWindow.setSheetOffset(titlebarHeight);

  prefsWindow.on('close', () => {
    prefsWindow = undefined;
  });

  loadRoute(prefsWindow, 'preferences');

  await pEvent(prefsWindow.webContents, 'did-finish-load');

  if (options) {
    prefsWindow.webContents.send('options', options);
  }

  prefsWindow.webContents.send('mount');

  await new Promise<void>(resolve => {
    ipcMain.removeHandler('preferences-ready');
    ipcMain.handle('preferences-ready', () => {
      ipcMain.removeHandler('preferences-ready');
      resolve();
    });
  });

  prefsWindow.show();
  return prefsWindow;
};

const closePrefsWindow = () => {
  if (prefsWindow) {
    prefsWindow.close();
  }
};

ipcMain.handle('open-preferences', async (_event, options) => {
  await openPrefsWindow(options);
});

windowManager.setPreferences({
  open: openPrefsWindow,
  close: closePrefsWindow,
});
