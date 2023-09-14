import { randomUUID } from 'node:crypto';

import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

type UserDocument = mongoose.InferSchemaType<typeof schema>;

const UserModel = mongoose.model<UserDocument>('User', schema);

export type { UserDocument };
export { UserModel };
