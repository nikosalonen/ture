
import {BrowserWindow, dialog} from 'electron';
import execa from 'execa';
import tempy from 'tempy';
import fs from 'node:fs';
import path from 'node:path';
import type {Video} from '../video';
import {generateTimestampedName} from './timestamped-name';
import ffmpegPath from './ffmpeg-path';

const getBase64DataUri = async (filePath: string): Promise<string> => {
  const data = await fs.promises.readFile(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${data.toString('base64')}`;
};

export const generatePreviewImage = async (filePath: string): Promise<{path: string; data: string} | undefined> => {
  const previewPath = tempy.file({extension: '.jpg'});

  try {
    await execa(ffmpegPath, [
      '-ss',
      '0',
      '-i',
      filePath,
      '-t',
      '1',
      '-vframes',
      '1',
      '-f',
      'image2',
      previewPath,
    ]);
  } catch {
    return;
  }

  try {
    return {
      path: previewPath,
      data: await getBase64DataUri(previewPath),
    };
  } catch {
    return {
      path: previewPath,
      data: '',
    };
  }
};

export const saveSnapshot = async (video: Video, time: number) => {
  const {filePath: outputPath} = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow()!, {
    defaultPath: generateTimestampedName('Snapshot', '.jpg'),
  });

  if (outputPath) {
    await execa(ffmpegPath, [
      '-i',
      video.filePath,
      '-ss',
      time.toString(),
      '-vframes',
      '1',
      outputPath,
    ]);
  }
};
