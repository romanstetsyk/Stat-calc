import { ERROR_MESSAGES } from '@shared/build/esm/index.js';
import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
    toObject: { getters: true },
  },
);

const errorHandler: mongoose.ErrorHandlingMiddlewareFunction = (
  error,
  _doc,
  next,
) => {
  const DUPLICATE_KEY_ERROR = 11_000;

  if (
    error.name === 'MongoServerError' &&
    'code' in error &&
    error.code === DUPLICATE_KEY_ERROR
  ) {
    next(new Error(ERROR_MESSAGES.DUPLICATE_KEY));
  } else {
    next();
  }
};
schema.post('save', errorHandler);

type UserDocument = mongoose.InferSchemaType<typeof schema>;

const UserModel = mongoose.model<UserDocument>('User', schema);

export type { UserDocument };
export { UserModel };
