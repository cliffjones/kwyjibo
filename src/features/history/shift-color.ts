import './style.scss';

// Converts a fractional number to a two-digit hexadecimal.
const fractionToHex = (value: number) =>
  Math.round(value * 255)
    .toString(16)
    .padStart(2, '0');

// Shifts the hue of a given hexadecimal color string by a given percent.
export const shiftColor = (color: string, offset = 42) => {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color);
  if (!match) {
    return color;
  }

  // Convert three-digit codes to six digits.
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((digit) => digit + digit)
      .join('');
  }

  let red = parseInt(hex.slice(0, 2), 16) / 255;
  let green = parseInt(hex.slice(2, 4), 16) / 255;
  let blue = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  let saturation = 0;
  let hue = 0;
  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
    hue *= 60;
  }
  hue = (((hue + offset * 3.6) % 360) + 360) % 360;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const segment = hue / 60;

  if (segment < 1) {
    [red, green, blue] = [chroma, x, 0];
  } else if (segment < 2) {
    [red, green, blue] = [x, chroma, 0];
  } else if (segment < 3) {
    [red, green, blue] = [x, 0, chroma];
  } else if (segment < 4) {
    [red, green, blue] = [chroma, 0, x];
  } else if (segment < 5) {
    [red, green, blue] = [chroma, x, 0];
  } else {
    [red, green, blue] = [x, chroma, 0];
  }

  const matchValue = lightness - chroma / 2;
  red += matchValue;
  green += matchValue;
  blue += matchValue;

  return `#${fractionToHex(red)}${fractionToHex(green)}${fractionToHex(blue)}`;
};
