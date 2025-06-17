import cors from "cors"
import express from "express";
import userRoutes from "../routes/user.route.js";
import postRoutes from "../routes/post.route.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
	// origin: "http://localhost:5173",
	origin: "https://tagly-social-media-app.onrender.com",
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get("/health-check", (req, res) => res.status(200).send("Server is live..."));
app.use(userRoutes)
app.use(postRoutes)
export default app;