import { EnvError, makeValidator } from 'envalid';

const validateUrlList = makeValidator<string[]>((input: string): string[] => {
  const urlArray = input.split(/\s*,\s*/);
  for (const urlString of urlArray) {
    // Check if url is valid. Taken from envalid/src/validators.ts
    try {
      new URL(urlString);
    } catch {
      throw new EnvError(`Invalid url: "${urlString}"`);
    }
  }
  return urlArray;
});

export { validateUrlList };
