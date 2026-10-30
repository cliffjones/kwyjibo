export const CONTENT_VARIANTS = [
  'left',
  'right',
];

export const CONTENT_DELIMS = {
  code: '`',
  em: '*',
};

export const CONTENT_LIST_ITEM_PATTERN = /^(?:\r?\n| {2,})?- ([^\r\n]*?)(?=(?: {2,}- )|\r?\n|$)/;
export const CONTENT_IMAGE_LINK_PATTERN = /^\[!\[([^\]\r\n]*)\]\(([^\s)\r\n]+)\)\]\(([^\s)\r\n]+)(?:\s+"([^"\r\n]*)")?\)/;
export const CONTENT_IMAGE_PATTERN = /^!\[([^\]\r\n]*)\]\(([^\s)\r\n]+)\)/;
export const CONTENT_LINK_PATTERN = /^\[([^\]\r\n]*)\]\(([^\s)\r\n]+)(?:\s+"([^"\r\n]*)")?\)/;
