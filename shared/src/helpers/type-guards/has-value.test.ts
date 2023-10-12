import { describe, expect, it } from 'vitest';

import { hasValue } from './has-value';

describe('has-value', () => {
  const arr = Array.from({ length: 5 }, (_, i) => i);
  const obj = { a: 'A', b: 'B' };

  it('should return false if obj is primitive', () => {
    expect(hasValue(Math.random(), true)).toBe(false);
    expect(hasValue('a', true)).toBe(false);
    expect(hasValue(true, true)).toBe(false);
    expect(hasValue(null, true)).toBe(false);
    expect(hasValue(undefined, true)).toBe(false);
  });

  it('should return true if obj is array and value is its element', () => {
    const value = 3;
    expect(hasValue(arr, value)).toBe(true);
  });

  it('should return false if obj is array and value is not its element', () => {
    const value = 5;
    expect(hasValue(arr, value)).toBe(false);
  });

  it('should return true if obj is object and value is one of its values', () => {
    const value = 'A';
    expect(hasValue(obj, value)).toBe(true);
  });

  it('should return false if obj is object and value is not one of its values', () => {
    const value = 'a';
    expect(hasValue(obj, value)).toBe(false);
  });
});
