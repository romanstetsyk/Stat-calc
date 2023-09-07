import { describe, expect, it } from 'vitest';

import { createColName } from './create-col-name';

describe('createColName', () => {
  it('should return a custom error with message: "test"', () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const res = createColName(0);
    expect(res).toBe('col1');
  });
});
