import sinon from 'sinon';
import tempy from 'tempy';
import path from 'node:path';

const temporaryDir = tempy.directory();

process.env.TZ = 'America/New_York';
(process.versions as any).chrome = '';

export const app = {
  getPath: (name: string) => path.resolve(temporaryDir, name),
  isPackaged: false,
  getVersion: '',
};

export const shell = {
  showItemInFolder: sinon.fake(),
};

export const clipboard = {
  writeText: sinon.fake(),
};

// remote module is now provided by @electron/remote package, not electron itself
