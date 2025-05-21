import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		image: {
			type: String,
			required: true
		},
		mediaPublicId: {
			type: String,
			required: true
		},
		location: {
			type: String,
			required: true,
			trim: true
		},
		caption: {
			type: String,
			required: true,
			trim: true
		},
	}, { timestamps: true }
)

const postModel = mongoose.model("Post", postSchema);
export default postModel;