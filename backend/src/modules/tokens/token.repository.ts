import type { HydratedDocument } from 'mongoose';

import { TokenEntity } from './token.entity.js';
import type { TokenDocument, TokenModel } from './token.model.js';
import type { TokenBody } from './types.js';

class TokenRepository {
  private tokenModel: typeof TokenModel;

  public constructor(tokenModel: typeof TokenModel) {
    this.tokenModel = tokenModel;
  }

  public async getAll(): Promise<TokenEntity[]> {
    const allTokens: HydratedDocument<TokenDocument>[] =
      await this.tokenModel.find({});
    return allTokens.map((token) => new TokenEntity(token.toObject()));
  }

  public async saveToken(payload: TokenBody): Promise<TokenEntity> {
    const newToken: HydratedDocument<TokenDocument> =
      await this.tokenModel.create(payload);

    return new TokenEntity(newToken.toObject());
  }

  public async delete(payload: {
    token: string;
    userId: string;
  }): Promise<TokenEntity | null> {
    const deletedToken: HydratedDocument<TokenDocument> | null =
      await this.tokenModel.findOneAndDelete(payload);

    return deletedToken ? new TokenEntity(deletedToken.toObject()) : null;
  }

  public async update(
    oldToken: TokenBody,
    newToken: TokenBody,
  ): Promise<TokenEntity | null> {
    const savedToken: HydratedDocument<TokenDocument> | null =
      await this.tokenModel.findOneAndReplace(oldToken, newToken, {
        new: true,
      });

    return savedToken ? new TokenEntity(savedToken.toObject()) : null;
  }
}

export { TokenRepository };
