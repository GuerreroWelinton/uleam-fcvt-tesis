import mongoose from "mongoose";

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      console.log("Mongo database connected successfully 🟢");
      return true;
    } catch (error) {
      console.log("Error connecting to mongo database 🔴");
      throw error;
    }
  }
}
