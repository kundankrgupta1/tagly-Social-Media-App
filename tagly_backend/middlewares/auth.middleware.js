import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()
const authMiddleware = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1] || req.cookies.accessToken;
		if (!token || token === "undefined") {
			return res.status(401).json({
				message: `⚠️ Unauthorized access! No token provided!!!`,
				success: false
			});
		}
		jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS_TOKEN, (error, decoded) => {
			if (error) {
				return res.status(401).json({
					message: `⚠️ ${error.message}`,
					success: false
				});
			}
			req.user = decoded;
			next();
		})
	} catch (error) {
		return res.status(502).json({
			message: `⚠️ Error while verifying the token: ${error.message}`,
			success: false
		})
	}
}

export default authMiddleware;