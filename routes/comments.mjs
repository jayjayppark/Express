import express from "express";
import Comments from "../schemas/comments.mjs";
import authMiddleware from "../middlewares/auth-middleware.mjs";

const router = express.Router();

// comment 작성 API
router.post("/:postId", authMiddleware, async (req, res) => {
    const { body } = req.body;
    const { postId } = req.params;
    const { nickname } = res.locals.user;

    if (!body || body.trim() === "") {
        console.log("입력 시도 실패");
        return res.status(400).json({ errMessage: "입력폼을 다 채워주세요" });
    }

    try {
        const createdComment = await Comments.create({ postId, body, nickname });

        res.json({ post: createdComment });
    } catch (err) {
        console.error(err);
        res.status(502).json({ errorMessage: "post comment fail" });
    }
})

// 해당 post의 comment 목록 조회 API
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comments.find({ postId })
            .sort("-date");

        res.json({ comments, result: "success" });
    } catch (err) {
        console.error(err);
        res.status(503).json({ errorMessage: "can not access database" });
    }
});

// comment 수정 API
router.patch("/:commentId", authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { nickname } = res.locals.user;
        const { body } = req.body;
        // content가 없는 경우 처리
        if (!body || body.trim() === "") {
            console.log("입력 시도 실패");
            return res.status(400).json({ errMessage: "입력폼을 다 채워주세요" });
        }
        // 게시물을 postId로 찾아서 title과 body 업데이트
        const updatedComment = await Comments.findOneAndUpdate(
            { _id: commentId, nickname },
            { body },
            { new: true }
        );

        // 게시물이 존재하지 않을 경우
        if (!updatedComment) {
            return res.status(404).json({ errMessage: "댓글을 찾을 수 없습니다." });
        }

        // 성공적으로 업데이트된 게시물을 응답으로 반환
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Stack trace:", error.stack);
        return res.status(500).json({ errMessage: "서버 오류가 발생했습니다." });
    }
});

// comment 삭제 API
router.delete("/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { nickname } = res.locals.user;
    try {
        const deletedComment = await Comments.deleteOne({ _id: commentId, nickname });

        if (deletedComment.deletedCount === 0) {
            return res.status(404).json({ errorMessage: "Post not found" });
        }

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ errorMessage: "Failed to delete post" });
    }
});

export default router;