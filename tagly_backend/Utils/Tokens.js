import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: "1d" });
}

const generateRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: "7d" });
}

export default { generateAccessToken, generateRefreshToken };
