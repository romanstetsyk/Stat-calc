import type { TOKEN_TYPES } from '~/packages/token-util/token-util.js';

type TokenEntityConstructor = {
  id: string;
  token: string;
  userId: string;
  type: TOKEN_TYPES;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class TokenEntity {
  public id: string;
  public token: string;
  public userId: string;
  public type: TOKEN_TYPES;
  public blacklisted: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor({
    id,
    token,
    userId,
    type,
    blacklisted = false,
    createdAt,
    updatedAt,
  }: TokenEntityConstructor) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.type = type;
    this.blacklisted = blacklisted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export { TokenEntity };
