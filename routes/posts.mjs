import express from "express";
import Posts from "../schemas/posts.mjs";
import Comments from "../schemas/comments.mjs";
import authMiddleware from "../middlewares/auth-middleware.mjs";

const router = express.Router();

// 전체 게시글 목록 조회 API
router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find({}, { title: 1, nickname: 1, date: 1, _id: 1 })
            .sort("-date");

        res.json({ posts: posts, result: "success" });
    } catch (err) {
        console.error(err);
        res.status(503).json({ errorMessage: "can not access database" });
    }
});

// 게시글 작성 API
router.post("/", authMiddleware, async (req, res) => {
    const { title, body } = req.body;
    const { nickname } = res.locals.user;

    if (!title || !body || title.trim() === "" || body.trim() === "") {
        console.log("입력 시도 실패");
        return res.status(400).json({ errMessage: "입력폼을 다 채워주세요" });
    }

    try {
        const createdPost = await Posts.create({ title, nickname, body });

        res.json({ post: createdPost });
    } catch (err) {
        console.error(err);
        res.status(502).json({ errorMessage: "post fail" });
    }
})

// 게시글 조회 API
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Posts.findById(postId).exec();

        if (!post) return res.status(404).json({ errorMessage: "post not exist" });

        res.json({ post, result: "success" });
    } catch (err) {
        console.error(err);
        res.status(502).json({ errorMessage: "fail check" });
    }
});

// 게시글 수정 API
router.patch("/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { nickname } = res.locals.user;
        const { title, body } = req.body;
        // title이나 content가 없는 경우 처리
        if (!title || !body || title.trim() === "" || body.trim() === "") {
            console.log("입력 시도 실패");
            return res.status(400).json({ errMessage: "입력폼을 다 채워주세요" });
        }
        // 게시물을 postId로 찾아서 title과 body 업데이트
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: postId, nickname },
            { title, body },
            { new: true }
        );

        // 게시물이 존재하지 않을 경우
        if (!updatedPost) {
            return res.status(404).json({ errMessage: "게시물을 찾을 수 없습니다." });
        }

        // 성공적으로 업데이트된 게시물을 응답으로 반환
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Stack trace:", error.stack);
        return res.status(500).json({ errMessage: "서버 오류가 발생했습니다." });
    }
});

// 게시글 삭제 API
router.delete("/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals.user;
    try {
        const deletedPost = await Posts.deleteOne({ _id: postId, nickname });

        if (deletedPost.deletedCount === 0) {
            return res.status(404).json({ errorMessage: "Post not found" });
        }

        // 해당 게시글의 모든 댓글 삭제
        await Comments.deleteMany({ postId });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ errorMessage: "Failed to delete post" });
    }
});

export default router;