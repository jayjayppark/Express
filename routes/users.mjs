import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/users.mjs";
import authMiddleware from "../middlewares/auth-middleware.mjs";
import config from "../config/index.mjs";

const router = express.Router();

// 로그인 API
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname });

    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
    if (!user || password !== user.password) {
        res.status(400).json({
            errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
        });
        return;
    }

    const token = jwt.sign(
        { userId: user._id }, // user.userId
        config.secretKey,
    );

    res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
    res.status(200).json({ token }); // JWT를 Body로 할당합니다!
});

function validateNickname(nickname) {
    // 정규 표현식을 사용하여 닉네임이 유효한지 확인합니다.
    const regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(nickname);
}

function validatePassword(password, nickname) {
    // 비밀번호는 최소 4자 이상이어야 합니다.
    if (password.length < 4) {
        return false;
    }
    // 비밀번호에 닉네임이 포함되어 있는지 확인합니다.
    if (password.includes(nickname)) {
        return false;
    }
    return true;
}

// 회원가입 API
router.post("/register", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;
    if (!validateNickname(nickname)) {
        res.status(400).json({
            errorMessage: "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성되어야합니다.",
        });
        return;
    }

    if (!validatePassword(password, nickname)) {
        res.status(400).json({
            errorMessage: "비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함되면 안됩니다.",
        });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }

    // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findOne({ nickname });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
        res.status(400).json({
            errorMessage: "중복된 닉네임입니다.",
        });
        return;
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({ status: "회원가입 성공!!" });
});

// 내 정보 조회 API
router.get("/me", authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;

    res.status(200).json({
        user: { nickname }
    });
});

export default router;