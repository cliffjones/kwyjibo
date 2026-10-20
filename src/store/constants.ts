import { QuizSettings } from './types';

export const STORAGE_KEY = 'kwyjibo';
export const BASE_URL = document.querySelector('base')?.getAttribute('href') ?? '/';
export const DATA_PATH = `${BASE_URL}data/`;

export const SETTINGS_KEYS = ['language', 'initialContent'] satisfies (keyof QuizSettings)[];
