import execa from 'execa';

const ffmpegPath = require('ffmpeg-static');

const getDuration = (text: string): number => {
  const durationString = /Duration: ([\d:.]*)/.exec(text)?.[1];
  if (!durationString) {
    return 0;
  }

  const parts = durationString.split(':');
  const hours = Number.parseFloat(parts[0]);
  const minutes = Number.parseFloat(parts[1]);
  const seconds = Number.parseFloat(parts[2]);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const getEncoding = (text: string) => /Stream.*Video: (.*?)[, ]/.exec(text)?.[1];

const getFps = (text: string) => {
  const fpsString = /([\d.]*) fps/.exec(text)?.[1];
  return Number.parseFloat(fpsString!);
};

const getSize = (text: string) => {
  const sizeText = /Video:.*?, (\d*x\d*)/.exec(text)?.[1]!;
  const parts = sizeText.split('x');
  return {
    width: Number.parseFloat(parts[0]),
    height: Number.parseFloat(parts[1]),
  };
};

const getHasAudio = (text: string) => /Stream #.*: Audio/.test(text);

// @ts-expect-error
export const getVideoMetadata = async (path: string): Promise<{
  duration: number;
  encoding: string;
  fps: number;
  size: {width: number; height: number};
  hasAudio: boolean;
}> => {
  try {
    await execa(ffmpegPath, ['-i', path]);
  } catch (error) {
    const {stderr} = error as any;
    return {
      duration: getDuration(stderr),
      encoding: getEncoding(stderr)!,
      fps: getFps(stderr)!,
      size: getSize(stderr) as {width: number; height: number},
      hasAudio: getHasAudio(stderr)!,
    };
  }
};
