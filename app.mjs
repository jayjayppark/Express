import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.mjs";
import connect from "./schemas/index.mjs";
import config from "./config/index.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [indexRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log(config.port, '포트로 서버가 열렸어요!');
});
