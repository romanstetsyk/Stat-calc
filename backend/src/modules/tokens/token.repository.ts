import type { HydratedDocument } from 'mongoose';

import { TokenEntity } from './token.entity.js';
import type { TokenDocument, TokenModel } from './token.model.js';

class TokenRepository {
  private tokenModel: typeof TokenModel;

  public constructor(tokenModel: typeof TokenModel) {
    this.tokenModel = tokenModel;
  }

  public async saveToken(
    payload: Omit<TokenEntity, 'id'>,
  ): Promise<TokenEntity> {
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
}

export { TokenRepository };
