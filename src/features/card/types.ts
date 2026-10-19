type TextToken = {
  type: 'text' | 'code' | 'em';
  text: string;
};

type LinkToken = {
  type: 'link' | 'image';
  text: string;
  url: string;
  title?: string;
};

export type InlineToken = TextToken | LinkToken;
