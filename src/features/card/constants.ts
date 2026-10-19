export const LENGTH_SIZING_FLOOR = 50;
export const LENGTH_SIZING_CEILING = 250;

export const DELIMS = {
  code: '`',
  em: '*'
} as const;

export const LINK_PATTERN = /^(!?)\[([^\]\r\n]*)\]\(([^\s)\r\n]+)(?:\s+"([^"\r\n]*)")?\)/;
