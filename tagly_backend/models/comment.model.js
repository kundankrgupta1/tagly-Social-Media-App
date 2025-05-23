import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	comment: {
		type: String,
		required: true,
		trim: true
	}
}, { timestamps: true, versionKey: false });

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;


