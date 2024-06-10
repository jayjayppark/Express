import mongoose from "mongoose";

export const post = (req, res, next) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ errMessage: "object id가 이상함" });
    }
    next();
};

export const comm = (req, res, next) => {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({ errMessage: "object id가 이상함" });
    }
    next();
};
