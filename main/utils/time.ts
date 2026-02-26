/**
 * Parse a time string like "HH:MM:SS.ff" into milliseconds.
 */
export const parseTimeStringToMs = (timeString: string): number => {
  const parts = timeString.split(':');
  const hours = Number.parseFloat(parts[0]);
  const minutes = Number.parseFloat(parts[1]);
  const seconds = Number.parseFloat(parts[2]);
  return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
};

/**
 * Parse a time string like "HH:MM:SS.mmm" into seconds.
 */
export const parseTimeStringToSeconds = (timeString: string): number => parseTimeStringToMs(timeString) / 1000;

/**
 * Format seconds into a time string.
 *
 * - For times >= 1 hour: "h:mm:ss" or "h:mm:ss.SS"
 * - For times < 1 hour: "m:ss" or "m:ss.SS"
 */
export const formatTime = (seconds: number, options: {showMilliseconds?: boolean} = {}): string => {
  const {showMilliseconds = false} = options;

  const totalMs = Math.round(seconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;

  const pad2 = (n: number) => String(n).padStart(2, '0');

  let result = '';

  if (hours > 0) {
    result = `${hours}:${pad2(minutes)}:${pad2(secs)}`;
  } else {
    result = `${minutes}:${pad2(secs)}`;
  }

  if (showMilliseconds) {
    // Show centiseconds (2 digits) to match moment's .SS format
    const centiseconds = Math.floor(ms / 10);
    result += `.${pad2(centiseconds)}`;
  }

  return result;
};
