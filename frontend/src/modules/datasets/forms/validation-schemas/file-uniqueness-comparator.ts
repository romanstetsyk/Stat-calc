const fileUniquenessComparator = (file1: File, file2: File): boolean => {
  const key1 = file1.name + file1.size + file1.lastModified;
  const key2 = file2.name + file2.size + file2.lastModified;
  return key1 === key2;
};

export { fileUniquenessComparator };
