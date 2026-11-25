// Returns a random hexadecimal color code.
export const getRandomColor = (): string =>
  `#${Math.floor(Math.random() * 0x1000000)
    .toString(16)
    .padStart(6, '0')}`;
