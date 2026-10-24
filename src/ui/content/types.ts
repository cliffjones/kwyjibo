type TextToken = {
  type: 'text';
  text: string;
};

type FormattedToken = {
  type: 'code' | 'em';
  text: string;
};

type ListItemToken = {
  type: 'list-item';
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
  image?: Omit<ImageToken, 'type'>;
};

export type InlineToken = TextToken | FormattedToken | ImageToken | LinkToken;
export type ContentToken = TextToken | ListItemToken;

export type InlineMatch = {
  token: InlineToken;
  length: number;
};
