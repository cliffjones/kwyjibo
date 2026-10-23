type TextToken = {
  type: 'text' | 'code' | 'em';
  text: string;
};

type ImageToken = {
  type: 'image';
  text: string;
  url: string;
};

type LinkToken = {
  type: 'link';
  text: string;
  url: string;
  title?: string;
};

export type InlineToken = TextToken | ImageToken | LinkToken;
