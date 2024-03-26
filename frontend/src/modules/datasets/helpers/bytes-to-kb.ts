import { FILESIZES } from '@shared/build/esm/index';

const bytesToKb = (bytes: number, decimals?: number): string => {
  const kib = bytes / FILESIZES['1KiB'];
  return kib.toFixed(decimals ?? 0);
};

export { bytesToKb };
