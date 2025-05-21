import followModel from "../models/Follow.model";
import userModel from "../models/user.model";

const followUser = async (req, res) => {
	const { _id } = req.user;
	const { followingId } = req.body;
	try {

		if (_id === followingId) {
			return res.status(409).json({
				message: "you can't follow your self",
				success: false
			})
		}

		const currentLoginedUser = await userModel.findById(_id)
		const targetUser = await userModel.findById(followingId)

		if (!currentLoginedUser || !targetUser) {
			return res.status(404).json({
				message: "user not found",
				success: false
			})
		}

		const alreadyFollowed = await followModel.findOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		if (alreadyFollowed) {
			return res.status(409).json({
				message: "You already followed this user",
				success: false
			})
		}

		const newFollow = new followModel({
			followerId: currentLoginedUser._id, followingId: targetUser._id
		})

		await newFollow.save();

		return res.status(201).json({
			message: "follow kar liya",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Internal Error",
			error: error,
			success: fasle
		})
	}
}

const unfollow = async (req, res) => {
	const { _id } = req.user;
	const { followingId } = req.body;
	try {

		const currentLoginedUser = await userModel.findById(_id)
		const targetUser = await userModel.findById(followingId)

		if (!currentLoginedUser || !targetUser) {
			return res.status(404).json({
				message: "user not found",
				success: false
			})
		}

		const alreadyFollowed = await followModel.findOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		if (!alreadyFollowed) {
			return res.status(401).json({
				message: "You never followed",
				success: false
			})
		}

		await followModel.deleteOne({
			followerId: currentLoginedUser._id,
			followingId: targetUser._id
		})

		return res.status(200).json({
			message: "Unfollow ho gya",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Internal error",
			error: error,
			success: false
		})
	}
}

export default { followUser, unfollow };
