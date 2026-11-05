import { isValidUrl } from './is-valid-url';

// Loads a remote text file from a given URL, returning the text or null if the load fails.
export const loadRemoteText = async (url: string): Promise<string | null> => {
  if (!isValidUrl(url)) {
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.text();
    if (response.headers.get('content-type')?.includes('text/html') || /^\s*(?:<!doctype\s+html|<html\b)/i.test(data)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
};
