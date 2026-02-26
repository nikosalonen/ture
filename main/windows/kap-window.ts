import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import {enable as enableRemote} from '@electron/remote/main';
import pEvent from 'p-event';
import {customApplicationMenu, defaultApplicationMenu, MenuModifier} from '../menus/application';
import {loadRoute} from '../utils/routes';

interface KapWindowOptions<State> extends Electron.BrowserWindowConstructorOptions {
  route: string;
  waitForMount?: boolean;
  initialState?: State;
  menu?: MenuModifier;
  dock?: boolean;
}

// TODO: remove this when all windows use KapWindow
app.on('browser-window-focus', (_, window) => {
  if (!KapWindow.fromId(window.id)) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(defaultApplicationMenu()));
  }
});

// Has to be named BrowserWindow because of
// https://github.com/electron/electron/blob/master/lib/browser/api/browser-window.ts#L82
export default class KapWindow<State = any> {
  static defaultOptions: Partial<KapWindowOptions<any>> = {
    waitForMount: true,
    dock: true,
    menu: defaultMenu => defaultMenu
  };

  private static readonly windows = new Map<number, KapWindow>();
  private static readonly windowCallbacks = new Map<string, Map<number, (...args: any[]) => any>>();

  browserWindow: BrowserWindow;
  state?: State;
  menu: Menu = Menu.buildFromTemplate(defaultApplicationMenu());
  readonly id: number;
  mountResolve?: () => void;

  private readonly readyPromise: Promise<void>;
  private readonly cleanupMethods: Array<() => void> = [];
  private readonly options: KapWindowOptions<State>;

  constructor(private readonly props: KapWindowOptions<State>) {
    const {
      route,
      waitForMount,
      initialState,
      ...rest
    } = props;

    this.browserWindow = new BrowserWindow({
      ...rest,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        ...rest.webPreferences
      },
      show: false
    });
    enableRemote(this.browserWindow.webContents);
    this.id = this.browserWindow.id;
    KapWindow.windows.set(this.id, this);

    this.cleanupMethods = [];
    this.options = {
      ...KapWindow.defaultOptions,
      ...props
    };

    this.state = initialState;
    this.generateMenu();
    this.readyPromise = this.setupWindow();
  }

  static getAllWindows() {
    return [...this.windows.values()];
  }

  static fromId(id: number) {
    return this.windows.get(id);
  }

  get webContents() {
    return this.browserWindow.webContents;
  }

  cleanup = () => {
    KapWindow.windows.delete(this.id);

    for (const method of this.cleanupMethods) {
      method();
    }
  };

  callRenderer = (channel: string, data?: any) => {
    if (!this.browserWindow.isDestroyed()) {
      this.browserWindow.webContents.send(channel, data);
    }
  };

  answerRenderer = (channel: string, callback: (...args: any[]) => any) => {
    if (!KapWindow.windowCallbacks.has(channel)) {
      KapWindow.windowCallbacks.set(channel, new Map());
      ipcMain.handle(channel, (event, ...args) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win) {
          return;
        }

        const cb = KapWindow.windowCallbacks.get(channel)?.get(win.id);
        return cb?.(...args);
      });
    }

    KapWindow.windowCallbacks.get(channel)!.set(this.id, callback);
    this.cleanupMethods.push(() => {
      KapWindow.windowCallbacks.get(channel)?.delete(this.id);
    });
  };

  setState = (partialState: State) => {
    this.state = {
      ...this.state,
      ...partialState
    };

    if (!this.browserWindow.isDestroyed()) {
      this.browserWindow.webContents.send('kap-window-state', this.state);
    }
  };

  whenReady = async () => {
    return this.readyPromise;
  };

  private readonly generateMenu = () => {
    this.menu = Menu.buildFromTemplate(
      customApplicationMenu(this.options.menu!)
    );
  };

  private async setupWindow() {
    const {waitForMount} = this.options;

    KapWindow.windows.set(this.id, this);

    this.browserWindow.on('show', () => {
      if (this.options.dock && !app.dock!.isVisible()) {
        app.dock!.show();
      }
    });

    this.browserWindow.on('close', this.cleanup);
    this.browserWindow.on('closed', this.cleanup);

    this.browserWindow.on('focus', () => {
      this.generateMenu();
      Menu.setApplicationMenu(this.menu);
    });

    this.webContents.on('did-finish-load', () => {
      if (this.state && !this.browserWindow.isDestroyed()) {
        this.browserWindow.webContents.send('kap-window-state', this.state);
      }
    });

    loadRoute(this.browserWindow, this.props.route);

    if (waitForMount) {
      return new Promise<void>(resolve => {
        this.mountResolve = resolve;
      });
    }

    await pEvent(this.webContents, 'did-finish-load');
    this.browserWindow.show();
  }
}

// Global IPC handlers for KapWindow — registered once at module load
ipcMain.handle('kap-window-state', event => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const kapWindow = win ? KapWindow.fromId(win.id) : undefined;
  return kapWindow?.state;
});

ipcMain.handle('kap-window-mount', event => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const kapWindow = win ? KapWindow.fromId(win.id) : undefined;

  if (kapWindow) {
    if (!kapWindow.browserWindow.isVisible()) {
      kapWindow.browserWindow.show();
    }

    kapWindow.mountResolve?.();
    kapWindow.mountResolve = undefined;
  }
});
