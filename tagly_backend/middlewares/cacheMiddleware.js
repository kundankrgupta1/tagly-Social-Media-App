import redisClient from "../Utils/redisClient.js";
import { handleError, handleSuccess } from "../Utils/responseHandler.js";

const cacheMiddleware = (keyPerfix = "") => {
	return async (req, res, next) => {
		const key = req.params.postId ? `${keyPerfix}:${req.params.postId}` : `${keyPerfix}:all`;

		try {
			const cachedData = await redisClient.get(key);

			if (cachedData) return handleSuccess(res, 200, "✅ Data fetched successfully from cache!!!", { [keyPerfix === "post" ? "post" : "allPost"]: JSON.parse(cachedData) })

			res.locals.cacheKey = key;
			next();
		} catch (error) {
			return handleError(res, 500, `⚠️ Error: ${error.message}`);
			next();
		}
	}
}

export default cacheMiddleware;
