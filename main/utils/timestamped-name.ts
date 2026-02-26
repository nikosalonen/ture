export const generateTimestampedName = (title = 'Kapture', extension = '') => {
  const now = new Date();
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const date = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  const time = `${pad2(now.getHours())}.${pad2(now.getMinutes())}.${pad2(now.getSeconds())}`;

  return `${title} ${date} at ${time}${extension}`;
};
