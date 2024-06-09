import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.mjs";
import connect from "./schemas/index.mjs";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [indexRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
