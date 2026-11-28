export type PathSegmentFiles = { segment: string; files: string[] };
export type PrivateFile = { segment: string; name: string; content: string };
export type PrivateFilesResponse = { segments: string[]; files: PrivateFile[] };
export type PrivateFiles = { segments: Set<string>; files: Map<string, string> };

export type ConfigData = {
  language?: string;
  languageMessage?: string;
  lightModeMessage?: string;
  homeMessage?: string;
  mosaicHint?: string;
  streakHint?: string;
  mosaicHeading?: string;
  sharedMosaicHeading?: string;
  mosaicShareHint?: string;
  mosaicCloseHint?: string;
  mosaicIntro?: string;
  mosaicOptionsPrompt?: string;
  title?: string;
  heading?: string;
  cardsLoadedMessage?: string;
  cardsRemainingMessage?: string;
  intro?: string;
  preloadedDataHeading?: string;
  customDataHeading?: string;
  customDataPlaceholder?: string;
  startButton?: string;
  historyHeading?: string;
  revealButton?: string;
  resetButton?: string;
  resetConfirmation?: string;
  yesButton?: string;
  noButton?: string;
  ratingPrompt?: string;
  ratingLabel1?: string;
  ratingLabel2?: string;
  ratingLabel3?: string;
  ratingLabel4?: string;
  ratingLabel5?: string;
  ratingMessage?: string;
  lastRatingMessage?: string;
  seconds?: string;
  minutes?: string;
  hours?: string;
  days?: string;
  noCardsMessage?: string;
  resultsMessage?: string;
  byline?: string;
  donationMessage?: string;
};

export type LineConfigData = {
  left?: boolean;
  right?: boolean;
  start?: boolean;
  end?: boolean;
  order?: number;
  value?: number;
};

export type ResponseData = {
  text: string;
  value: number;
  order: number;
};

export type TaskData = {
  task: string;
  topic?: string;
  type?: string;
  solution?: string;
  responses?: ResponseData[];
};

export type TaskItem = {
  id: number;
  type: string;
  topic: string;
  task: string;
  solution: string;
  responses: ResponseData[];
  rating: number;
};

export type HistoryItem = {
  time: number;
  type: string;
  topic: string;
  task: string;
  response?: string;
  rating: number;
};
