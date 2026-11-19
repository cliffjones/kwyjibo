const isDateToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

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
      date.toLocaleString(
        undefined,
        isDateToday(date)
          ? {
              hour: 'numeric',
              minute: '2-digit',
            }
          : {
              month: 'numeric',
              day: 'numeric',
            },
      ),
    );
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
