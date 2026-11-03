const SECONDS_IN_DAY = 24 * 60 * 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_MINUTE = 60;

export const formatDuration = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) {
    return '';
  }

  let remainingSeconds = Math.round(ms / 1000);

  const days = Math.floor(remainingSeconds / SECONDS_IN_DAY);
  remainingSeconds %= SECONDS_IN_DAY;

  const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
  remainingSeconds %= SECONDS_IN_HOUR;

  const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
  const seconds = remainingSeconds % SECONDS_IN_MINUTE;

  const parts: string[] = [];
  if (days) {
    parts.push(`${days} day${days === 1 ? '' : 's'}`);
  }
  if (hours) {
    parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }
  if (minutes) {
    parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  }
  if (seconds || parts.length === 0) {
    parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  }

  return parts.join(', ');
};
