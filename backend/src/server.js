import express from "express";
import testRoutes from "./routes/testRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import path, { join } from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

//Middlewares
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173" })); // Thay đổi URL nếu frontend chạy trên cổng khác
}

app.use(express.json());
app.use("/api/test", testRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}...`)
});

export default app;

