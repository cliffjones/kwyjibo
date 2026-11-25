import type { LineConfigData, PrivateFiles } from './types';

export const FORBIDDEN_JSON_KEYS = ['__proto__', 'constructor', 'prototype'];

export const BASE_URL = document.querySelector('base')?.getAttribute('href') ?? '/';
export const DATA_PATH = `${BASE_URL}data/`;

export const LINE_CONFIG_KEYS = [
  'left',
  'right',
  'start',
  'end',
  'order',
  'value',
] satisfies (keyof LineConfigData)[] as string[];

export const K_DELIMS = {
  namespace: ':',
  topic: '#',
};

export const ITEM_TYPES = {
  reminder: 'reminder',
  question: 'question',
  quiz: 'quiz',
  input: 'input',
};

export const EMPTY_PRIVATE_FILES: PrivateFiles = { segments: new Set(), files: new Map() };
