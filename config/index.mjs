import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    mongoURI: process.env.MONGO_URI,
};
