const classifyInput = (value: unknown): string | number => {
  switch (typeof value) {
    case 'number': {
      return value;
    }
    case 'string': {
      return value;
    }
    default: {
      return String(value);
    }
  }
};

export { classifyInput };
