import commentModel from "../models/comment.model";
import postModel from "../models/post.model";
import userModel from "../models/user.model";


const getAllComment = async (req, res) => {
	const { _id } = req.user;
	const { postId } = req.params;

	try {
		const user = await userModel.findById(_id);
		const postExist = await postModel.findById(postId)

		if (!user) {
			return res.status(401).json({
				message: "User not found",
				success: false
			})
		}
		if (!postExist) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}

		const allComment = await commentModel.find({ postId: postExist._id }).populate("userId", "_id username profilePicture").limit(10).sort({ createdAt: -1 });

		return res.status(201).json({
			success: true,
			message: "Comment fetched successfully",
			allComment
		})

	} catch (error) {

		return res.status(500).json({
			message: "Error while fetching comment",
			error: error.message,
			success: false
		})

	}
}

const postComment = async (req, res) => {
	const { _id } = req.user;
	const { postId, comment } = req.body;

	try {
		const user = await userModel.findById(_id);
		const postExist = await postModel.findById(postId)

		if (!user) {
			return res.status(401).json({
				message: "User not found",
				success: false
			})
		}
		if (!postExist) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}

		const newComment = new commentModel({
			postId: postExist._id,
			userId: user._id,
			comment
		})

		await newComment.save();

		return res.status(201).json({
			message: "Comment added successfully",
			comment: newComment,
			success: true
		})

	} catch (error) {

		return res.status(500).json({
			message: "Error while adding comment",
			error: error.message,
			success: false
		})
	}
}



const editComment = async (req, res) => {
	const { _id } = req.user;
	const { commentId, postId, newComment } = req.body;

	try {
		const user = await userModel.findById(_id);
		const commentExist = await commentModel.findById(commentId)
		const postExist = await postModel.exists({_id: postId})

		if (!user) {
			return res.status(401).json({
				message: "User not found",
				success: false
			})
		}
		if (!commentExist) {
			return res.status(404).json({
				message: "comment not found",
				success: false
			})
		}

		if (!postExist) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}

		if (commentExist.userId.toString() !== user._id.toString()) {
			return res.status(401).json({
				message: "Unauthorized, you can't update this comment",
				success: false
			})
		}

		await commentModel.findByIdAndUpdate(commentId, { comment: newComment }, { new: true });

		return res.status(201).json({
			message: "Comment updated successfully",
			comment: commentExist,
			success: true
		})

	} catch (error) {

		return res.status(500).json({
			message: "Error while updating comment",
			error: error.message,
			success: false
		})
	}
}

const deleteComment = async (req, res) => {
	const { _id } = req.user;
	const { commentId, postId } = req.body;

	try {
		const user = await userModel.findById(_id);
		const commentExist = await commentModel.findById(commentId)
		const postExist = await postModel.findById(postId)


		if (!user) {
			return res.status(401).json({
				message: "User not found",
				success: false
			})
		}
		if (!commentExist) {
			return res.status(404).json({
				message: "comment not found",
				success: false
			})
		}

		if (!postExist) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}

		if (commentExist.userId.toString() !== user._id.toString()) {
			return res.status(401).json({
				message: "Unauthorized, you can't update this comment",
				success: false
			})
		}

		await commentModel.findByIdAndDelete(commentId);

		return res.status(201).json({
			message: "Comment deleted successfully",
			success: true
		})


	} catch (error) {

		return res.status(500).json({
			message: "Error while deleting comment",
			error: error.message,
			success: false
		})

	}

}

export { getAllComment, postComment, editComment, deleteComment };
