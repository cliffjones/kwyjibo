export const formatTime = (value: number | string | null, compact = false) => {
  if (!value) {
    return '';
  }

  const date = new Date(Number(value));
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  if (compact) {
    return String(
      date.toLocaleString(undefined, {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }),
    ).replace(',', '');
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
