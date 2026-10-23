export const MD_DELIMS = {
  code: '`',
  em: '*'
};

export const MD_IMAGE_PATTERN = /^!\[([^\]\r\n]*)\]\(([^\s)\r\n]+)\)/;
export const MD_LINK_PATTERN = /^\[([^\]\r\n]*)\]\(([^\s)\r\n]+)(?:\s+"([^"\r\n]*)")?\)/;
