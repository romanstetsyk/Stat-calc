import { FILESIZES } from '@shared/build/esm/index';

const formatFileSize = (bytes: number, decimals?: number): string => {
  if (bytes < FILESIZES['1Kb']) {
    return `${bytes.toFixed(0)} bytes`;
  } else if (bytes < FILESIZES['1Mb']) {
    const mb = bytes / FILESIZES['1Kb'];
    return `${mb.toFixed(decimals ?? 0)} Kb`;
  } else {
    const mb = bytes / FILESIZES['1Mb'];
    return `${mb.toFixed(decimals ?? 0)} Mb`;
  }
};

export { formatFileSize };
