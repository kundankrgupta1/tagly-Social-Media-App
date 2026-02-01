import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { handleError, handleSuccess } from "../Utils/responseHandler.js";

const getAllComment = async (req, res) => {
	const { _id } = req.user;
	const { postId } = req.params;

	try {
		const user = await userModel.findById(_id);
		const postExist = await postModel.findById(postId)

		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");
		if (!postExist) return handleError(res, 404, "Post not found!!!");

		const allComment = await commentModel.find({ postId: postExist._id }).populate("userId", "_id username profilePicture").limit(10).sort({ createdAt: -1 });

		return handleSuccess(res, 200, "✅ Comment Fetched Successfully!!!", { allComment })
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const postComment = async (req, res) => {
	const { _id } = req.user;
	const { postId, comment } = req.body;

	try {
		const user = await userModel.findById(_id);
		const postExist = await postModel.findById(postId)

		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");
		if (!postExist) return handleError(res, 404, "Post not found!!!");

		const newComment = new commentModel({
			postId: postExist._id,
			userId: user._id,
			comment
		})

		await newComment.save();
		return handleSuccess(res, 201, "✅ Comment Added Successfully!!!", { comment: newComment })
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);

	}
}

const editComment = async (req, res) => {
	const { _id } = req.user;
	const { commentId, postId, newComment } = req.body;

	try {
		const user = await userModel.findById(_id);
		const commentExist = await commentModel.findById(commentId)
		const postExist = await postModel.exists({ _id: postId })

		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");
		if (!commentExist) return handleError(res, 404, "Comment not found!!!");

		if (!postExist) return handleError(res, 404, "Post not found!!!");

		if (commentExist.userId.toString() !== user._id.toString()) return handleError(res, 401, "You are not allowed!!!");

		await commentModel.findByIdAndUpdate(commentId, { comment: newComment }, { new: true });
		return handleSuccess(res, 200, "✅ Comment updated Successfully!!!", { comment: commentExist })
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const deleteComment = async (req, res) => {
	const { _id } = req.user;
	const { commentId, postId } = req.body;

	try {
		const user = await userModel.findById(_id);
		const commentExist = await commentModel.findById(commentId)
		const postExist = await postModel.findById(postId)


		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");
		if (!commentExist) return handleError(res, 404, "Comment not found!!!");

		if (!postExist) return handleError(res, 404, "Post not found!!!");

		if (commentExist.userId.toString() !== user._id.toString()) return handleError(res, 401, "Your not allowed to this actions!!!");

		await commentModel.findByIdAndDelete(commentId);

		return handleSuccess(res, 200, "✅ Comment Deleted Successfully!!!")
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}

}

export { getAllComment, postComment, editComment, deleteComment };
