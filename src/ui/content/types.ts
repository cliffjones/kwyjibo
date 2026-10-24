type TextToken = {
  type: 'text' | 'code' | 'em';
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

export type InlineToken = TextToken | ListItemToken | ImageToken | LinkToken;
