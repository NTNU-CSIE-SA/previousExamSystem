import express from 'express';
import { init_server } from './init';
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 5000;

init_server();
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
