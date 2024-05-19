import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: uuidv4,
    },
    // file name without extension
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    ext: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    buffer: {
      type: Buffer,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.UUID,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
    toObject: { getters: true },
  },
);

type DatasetDocument = mongoose.InferSchemaType<typeof schema>;

const DatasetModel = mongoose.model<DatasetDocument>('Dataset', schema);

export type { DatasetDocument };
export { DatasetModel };
