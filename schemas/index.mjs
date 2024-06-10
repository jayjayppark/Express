import mongoose from "mongoose";
import config from "../config/index.mjs";

mongoose.connect(config.mongoURI, {
})
  .then(value => console.log("MongoDB 연결에 성공하였습니다."))
  .catch(reason => console.log("MongoDB 연결에 실패하였습니다."))


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

export default db;