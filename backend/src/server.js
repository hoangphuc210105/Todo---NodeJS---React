import express from "express";
import testRoutes from "./routes/testRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();

//Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Thay đổi URL nếu frontend chạy trên cổng khác

app.use(express.json());
app.use("/api/test", testRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}...`)
    });
})

