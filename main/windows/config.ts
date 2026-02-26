'use strict';

import {BrowserWindow, ipcMain} from 'electron';
import {enable as enableRemote} from '@electron/remote/main';
import pEvent from 'p-event';

import {loadRoute} from '../utils/routes';
import {windowManager} from './manager';

const openConfigWindow = async (pluginName: string) => {
  const prefsWindow = await windowManager.preferences?.open();
  const configWindow = new BrowserWindow({
    width: 320,
    height: 436,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    show: false,
    parent: prefsWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  enableRemote(configWindow.webContents);

  loadRoute(configWindow, 'config');

  configWindow.webContents.on('did-finish-load', () => {
    configWindow.webContents.send('plugin', pluginName);
    configWindow.show();
  });

  await pEvent(configWindow, 'closed');
};

const openEditorConfigWindow = async (pluginName: string, serviceTitle: string, editorWindow: BrowserWindow) => {
  const configWindow = new BrowserWindow({
    width: 480,
    height: 420,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    show: false,
    parent: editorWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  enableRemote(configWindow.webContents);

  loadRoute(configWindow, 'config');

  configWindow.webContents.on('did-finish-load', () => {
    configWindow.webContents.send('edit-service', {pluginName, serviceTitle});
    configWindow.show();
  });

  await pEvent(configWindow, 'closed');
};

ipcMain.handle('open-edit-config', async (event, {pluginName, serviceTitle}) => {
  const window = BrowserWindow.fromWebContents(event.sender)!;
  return openEditorConfigWindow(pluginName, serviceTitle, window);
});

windowManager.setConfig({
  open: openConfigWindow
});
