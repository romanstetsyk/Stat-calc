import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { TOKEN_TYPES } from '~/packages/token-util/token-util.js';

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: uuidv4,
    },
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.UUID,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [TOKEN_TYPES.REFRESH],
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: true,
    toObject: { getters: true },
  },
);

type TokenDocument = mongoose.InferSchemaType<typeof schema>;

const TokenModel = mongoose.model<TokenDocument>('Token', schema);

export type { TokenDocument };
export { TokenModel };
