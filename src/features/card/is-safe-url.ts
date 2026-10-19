export const isSafeUrl = (url: string, isImage: boolean): boolean => {
  for (let index = 0; index < url.length; index += 1) {
    const characterCode = url.charCodeAt(index);
    if (characterCode < 0x20 || characterCode === 0x7f) {
      return false;
    }
  }

  const protocol = /^([a-z][a-z\d+.-]*):/i.exec(url.trim())?.[1].toLowerCase();
  return !protocol || protocol === 'http' || protocol === 'https' || (!isImage && protocol === 'mailto');
};
