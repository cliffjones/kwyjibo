// Contructs a CSS class string based on a base class and an optional space-separated variant string.
export const getClassString = (baseClass: string, variant?: string) => {
  const variants =
    variant
      ?.split(' ')
      .map((name) => name.trim())
      .filter(Boolean) ?? [];
  return [baseClass, ...variants.map((name) => `${baseClass}--${name}`)].join(' ');
};
