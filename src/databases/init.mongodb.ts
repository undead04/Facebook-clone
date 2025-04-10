"use strict";
import mongoose from "mongoose";
import config from "../configs/config";
const connectString = config.mongoURI;

class Database {
  private static instance: Database;
  constructor() {
    this.connect();
  }
  async connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectString)
      .then((_) => console.log("Connected Mongodb Success"))
      .catch((err) => console.log(err))
      .catch((error) => console.error(error));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
export default instanceMongodb;
