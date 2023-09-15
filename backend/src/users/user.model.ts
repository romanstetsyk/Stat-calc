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
  },
  {
    timestamps: true,
    id: true,
    toObject: { getters: true },
  },
);

type UserDocument = mongoose.InferSchemaType<typeof schema>;

const UserModel = mongoose.model<UserDocument>('User', schema);

export type { UserDocument };
export { UserModel };
