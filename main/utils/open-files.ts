'use strict';
import path from 'node:path';
import {supportedVideoExtensions} from '../common/constants';
import {Video} from '../video';

const fileExtensions = supportedVideoExtensions.map(ext => `.${ext}`);

export const openFiles = async (...filePaths: string[]) => Promise.all(filePaths
  .filter(filePath => fileExtensions.includes(path.extname(filePath).toLowerCase()))
  .map(async filePath => Video.getOrCreate({
    filePath,
  }).openEditorWindow()));

