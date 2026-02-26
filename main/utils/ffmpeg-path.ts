import ffmpeg from 'ffmpeg-static';

const ffmpegPath = ffmpeg.replace('app.asar', 'app.asar.unpacked');

export default ffmpegPath;
