import { describe, expect, it } from 'vitest';

import { createColumnName } from './create-column-name';

describe('createColumnName', () => {
  it('should return a custom error with message: "test"', () => {
    const res = createColumnName(0);
    expect(res).toBe('col1');
  });
});
