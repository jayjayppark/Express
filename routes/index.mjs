import express from "express";
import usersRouter from "./users.mjs";
import postsRouter from "./posts.mjs";
import commentsRouter from "./comments.mjs";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("welcome API!");
})

router.use("/user", usersRouter);
router.use("/post", postsRouter);
router.use("/comment", commentsRouter);

export default router;