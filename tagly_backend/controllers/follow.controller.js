import followModel from "../models/Follow.model.js";
import userModel from "../models/user.model.js";
import { handleError, handleSuccess } from "../Utils/responseHandler.js";

const followUser = async (req, res) => {
	const { _id } = req.user;
	const { followingId } = req.body;
	try {

		if (_id === followingId) return handleError(res, 409, "You cant follow you'r self!!!");

		const currentLoginedUser = await userModel.findById(_id)
		const targetUser = await userModel.findById(followingId)

		if (!currentLoginedUser || !targetUser) return handleError(res, 404, "User not found!!!, Login first!!");

		const alreadyFollowed = await followModel.findOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		if (alreadyFollowed) return handleError(res, 408, "not allowed!!!");

		const newFollow = new followModel({
			followerId: currentLoginedUser._id, followingId: targetUser._id
		})

		await newFollow.save();

		return handleSuccess(res, 201, "✅ Follow Successfully!!!")

	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const unfollow = async (req, res) => {
	const { _id } = req.user;
	const { followingId } = req.body;
	try {

		const currentLoginedUser = await userModel.findById(_id)
		const targetUser = await userModel.findById(followingId)

		if (!currentLoginedUser || !targetUser) return handleError(res, 404, "User not found!!!, Login first!!");

		const alreadyFollowed = await followModel.findOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		if (!alreadyFollowed) return handleError(res, 401, "not allowed!!!");

		await followModel.deleteOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		return handleSuccess(res, 200, "✅ unfollowes!!!")

	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	};
}

export default { followUser, unfollow };
