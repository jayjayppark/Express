import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        required: true
    }
});

export default mongoose.model("Posts", postsSchema);