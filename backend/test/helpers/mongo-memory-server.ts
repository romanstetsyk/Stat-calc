import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

class Database {
  private mongod: MongoMemoryServer | null = null;

  public async setUp(): Promise<void> {
    this.mongod = await MongoMemoryServer.create();
    const url = this.mongod.getUri();
    await mongoose.connect(url);
  }

  public async tearDown(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (this.mongod) {
      await this.mongod.stop();
    }
  }
}

export { Database };
