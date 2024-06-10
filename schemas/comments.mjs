import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    body: {
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
    }
},
    { strict: true });

export default mongoose.model("Comments", commentsSchema);