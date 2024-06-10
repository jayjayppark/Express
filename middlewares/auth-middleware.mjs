import jwt from "jsonwebtoken";
import User from "../schemas/users.mjs";
import config from "../config/index.mjs";

// 사용자 인증 미들웨어
export default async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" "); // Authorization값이 null이나 undefined일 경우 ""로 바꿔줌 아니면 split(" ")에서 오류

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, config.secretKey);
    const user = await User.findById(userId);
    res.locals.user = user; // 우리는 토큰에 담긴 `userId`로 해당 사용자가 실제로 존재하는지 확인했습니다.
    // 이미 데이터베이스에서 사용자 정보를 가져온것이죠.
    // 이 미들웨어를 사용하는 라우터에서는 굳이 **데이터베이스에서 사용자 정보를 가져오지 않게 할 수 있도록
    // `express`가 제공하는 안전한 변수인 `res.locals`에 담아두고, 언제나 꺼내서 사용할 수 있게 작성하였습니다!
    // 이렇게 담아둔 값은 정상적으로 응답 값을 보내고 나면 소멸하므로 해당 데이터가 어딘가에 남아있을 걱정의 여지를 남겨두지 않게 됩니다
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};