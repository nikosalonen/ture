const format = (seconds, {showMilliseconds} = {}) => {
  const totalMs = Math.round(seconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;

  const pad2 = n => String(n).padStart(2, '0');

  let result = '';

  if (hours > 0) {
    result = `${hours}:${pad2(minutes)}:${pad2(secs)}`;
  } else {
    result = `${minutes}:${pad2(secs)}`;
  }

  if (showMilliseconds) {
    const centiseconds = Math.floor(ms / 10);
    result += `.${pad2(centiseconds)}`;
  }

  return result;
};

const formatTime = (time, options) => {
  options = {
    showMilliseconds: false,
    ...options,
  };

  const durationFormatted = options.extra
    ? `  (${format(options.extra, options)})`
    : '';

  return `${format(time, options)}${durationFormatted}`;
};

export default formatTime;
