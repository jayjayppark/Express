import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.mjs";
import connect from "./schemas/index.mjs";
import config from "./config/index.mjs";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// 모든 요청에 대해 CORS 활성화
app.use(cors());

// CORS에 추가 옵션 설정 (선택 사항)
const corsOptions = {
    origin: '*', // 모든 도메인 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 자격 증명 허용
};

// 모든 요청에 대해 CORS 옵션 적용
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api", [indexRouter]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(config.port, () => {
    console.log(config.port, '포트로 서버가 열렸어요!');
});

// Swagger 설정
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'A simple CRUD API application with Express and documented with Swagger',
    },
    servers: [
        {
            url: 'https://jungleptest.xyz',
            // url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/swagger.mjs'], // API 경로
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));