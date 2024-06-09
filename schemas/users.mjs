import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model("Users", usersSchema);