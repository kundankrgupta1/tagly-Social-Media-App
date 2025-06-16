import { handleError } from "../Utils/responseHandler.js";
import Tokens from "../Utils/Tokens.js";
import dotenv from "dotenv";
dotenv.config()
const authMiddleware = async (req, res, next) => {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
		if (!accessToken || accessToken === "undefined") return handleError(res, 401, `⚠️ Unauthorized access! No token provided!!!`)

		const decoded = Tokens.VerifyToken(accessToken, "accessToken");
		if (!decoded) return handleError(res, 401, `⚠️ Unauthorized access! Invalid token!!!`);
		req.user = decoded;
		next();
	} catch (error) {
		return handleError(res, 401, `⚠️ Error: ${error.message}`);
	}
}

export default authMiddleware;