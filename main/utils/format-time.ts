import {formatTime as formatTimeHelper} from './time';

const formatTime = (time: number, options: any) => {
  options = {
    showMilliseconds: false,
    ...options,
  };

  const durationFormatted = options.extra
    ? `  (${formatTimeHelper(options.extra, options)})`
    : '';

  return `${formatTimeHelper(time, options)}${durationFormatted}`;
};

export default formatTime;
