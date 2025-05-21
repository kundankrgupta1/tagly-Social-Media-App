import mongoose from "mongoose";

const followSchema = mongoose.Schema({
	followerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	followingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
}, { timestamps: true, versionKey: false });

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const followModel = mongoose.model("Followers", followSchema);
export default followModel;