const parseFilename = (filename: string): { name: string; ext: string } => {
  const idx = filename.lastIndexOf('.');
  const [name, ext] =
    idx <= 0 ? [filename, ''] : [filename.slice(0, idx), filename.slice(idx)];
  return { name, ext };
};

export { parseFilename };
