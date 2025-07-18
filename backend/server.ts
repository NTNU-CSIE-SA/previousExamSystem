import express from 'express';
import { init_server } from './init';
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload_file";
import viewFileRouter from "./routes/view_file";
import filterRouter from "./routes/filter";
import userInfoRouter from "./routes/user_info";
import adminRouter from "./routes/admin";
import modifyRouter from "./routes/modify_files";
import watermarkRouter from "./routes/watermark";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
const app = express();

init_server();
const BACKEND_PORT = 80;
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/filter", filterRouter);
app.use("/api/upload-file", uploadRouter);
app.use("/api/view-file", viewFileRouter);
app.use("/api/user-info", userInfoRouter);
app.use("/api/admin", adminRouter);
app.use("/api/modify-file", modifyRouter);
app.use("/api", watermarkRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`Server is running on port ${BACKEND_PORT}`);
});
