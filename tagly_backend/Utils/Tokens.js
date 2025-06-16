import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_TIME}` });
}

const generateRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY_TIME}` });
}

const VerifyToken = (payload, text) => {
	return jwt.verify(payload, text === "accessToken" ? process.env.JWT_SECRET_KEY_ACCESS_TOKEN : process.env.JWT_SECRET_KEY_REFRESH_TOKEN);
}

export default { generateAccessToken, generateRefreshToken, VerifyToken };
