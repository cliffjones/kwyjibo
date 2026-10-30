import type { ConfigData, LineConfigData } from './types';

export const FORBIDDEN_JSON_KEYS = ['__proto__', 'constructor', 'prototype'];

export const BASE_URL = document.querySelector('base')?.getAttribute('href') ?? '/';
export const DATA_PATH = `${BASE_URL}data/`;

export const CONFIG_KEYS = [
  'language',
  'title',
  'heading',
  'intro',
  'footer',
] satisfies (keyof ConfigData)[] as string[];

export const LINE_CONFIG_KEYS = [
  'left',
  'right',
  'order',
  'value',
] satisfies (keyof LineConfigData)[] as string[];

export const K_DELIMS = {
  topic: '#',
};
