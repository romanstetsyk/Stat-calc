const isFiniteNumberString = (value: string): boolean => {
  if (value.trim() !== '') {
    return Number.isFinite(+value);
  }
  return false;
};

export { isFiniteNumberString };
