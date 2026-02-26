import sinon from 'sinon';
import {Writable, PartialDeep} from 'type-fest';
import type {Plugins} from '../../main/plugins';

export const plugins: PartialDeep<Writable<Plugins>> = {
  recordingPlugins: [],
  sharePlugins: [],
  editPlugins: [],
};
