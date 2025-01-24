import express from 'express';
import { init_server } from './init';
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload_file";
import viewFileRouter from "./routes/view_file";
const app = express();
const PORT = process.env.PORT || 5000;

init_server();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/upload_file", uploadRouter);
app.use("/api/view_file", viewFileRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});