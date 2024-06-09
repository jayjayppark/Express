import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/spa_post", {
})
  .then(value => console.log("MongoDB 연결에 성공하였습니다."))
  .catch(reason => console.log("MongoDB 연결에 실패하였습니다."))


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

export default db;