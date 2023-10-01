import type { TokenEntity } from './token.entity.js';

type TokenBody = Omit<TokenEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type { TokenBody };
