export const splitVariant = (text: string): { content: string; variant: string } => {
  if (!text.endsWith('}')) {
    return { content: text, variant: '' };
  }

  const suffixPosition = text.lastIndexOf('{');
  return suffixPosition < 0
    ? { content: text, variant: '' }
    : {
      content: text.slice(0, suffixPosition),
      variant: text.slice(suffixPosition + 1, -1)
    };
};
