import { ALTERNATION_PATTERN, LANG } from '../constants';
import { ConfigData } from './types';

const SECONDS_IN_DAY = 24 * 60 * 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_MINUTE = 60;

export const formatDuration = (ms: number, configData: ConfigData = {}): string => {
  let remainingSeconds = 0;
  if (Number.isFinite(ms) && ms > 0) {
    remainingSeconds = Math.round(ms / 1000);
  }

  const days = Math.floor(remainingSeconds / SECONDS_IN_DAY);
  remainingSeconds %= SECONDS_IN_DAY;

  const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
  remainingSeconds %= SECONDS_IN_HOUR;

  const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
  const seconds = remainingSeconds % SECONDS_IN_MINUTE;

  const parts: string[] = [];
  if (days) {
    parts.push(`${days} ${(configData.days || LANG.days).replace(ALTERNATION_PATTERN, days === 1 ? '$1' : '$2')}`);
  }
  if (hours) {
    parts.push(`${hours} ${(configData.hours || LANG.hours).replace(ALTERNATION_PATTERN, hours === 1 ? '$1' : '$2')}`);
  }
  if (minutes) {
    parts.push(
      `${minutes} ${(configData.minutes || LANG.minutes).replace(ALTERNATION_PATTERN, minutes === 1 ? '$1' : '$2')}`,
    );
  }
  if (seconds || !parts.length) {
    parts.push(
      `${seconds} ${(configData.seconds || LANG.seconds).replace(ALTERNATION_PATTERN, seconds === 1 ? '$1' : '$2')}`,
    );
  }

  return parts.join(', ');
};
