import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { cloudinary } from "../Utils/Cloudinary.js";
import { handleError, handleSuccess } from "../Utils/responseHandler.js";
// import redisClient from "../Utils/redisClient.js";

const createPost = async (req, res) => {
	const { _id } = req.user;
	const { image, location, caption } = req.body;

	try {
		const user = await userModel.findById(_id);
		if (!user) return handleError(res, 404, "User not found!!!, Login first!!!");

		if (!location || !caption) return handleError(res, 400, "all fields are required");

		const filePath = req.file?.path;

		if (!filePath) return handleError(res, 501, "File is required!!!");

		const cloudinaryURL = await uploadOnCloudinary(filePath)

		/*
			cloudinaryURL {
				asset_id: 'c12f8cd2fc7ed09651bb6281a59de4a3',
				public_id: 'posts/rlt9b5pyempvoghhac0d',
				version: 1747485701,
				version_id: '33afce6a357a565bd5e2206194ed06de',
				signature: '326f37472ee3648bd29ceb8d0af65392d64a981b',
				width: 1080,
				height: 1350,
				format: 'jpg',
				resource_type: 'image',
				created_at: '2025-05-17T12:41:41Z',
				tags: [],
				bytes: 158078,
				type: 'upload',
				etag: '948772a0cc3a1fb08dede8e8a25c53c7',
				placeholder: false,
				url: 'http://res.cloudinary.com/djt5tuvib/image/upload/v1747485701/posts/rlt9b5pyempvoghhac0d.jpg',
				secure_url: 'https://res.cloudinary.com/djt5tuvib/image/upload/v1747485701/posts/rlt9b5pyempvoghhac0d.jpg',
				asset_folder: 'posts',
				display_name: 'rlt9b5pyempvoghhac0d',
				original_filename: '1747485697651',
				api_key: '226981978797569'
			}
		*/

		if (!cloudinaryURL?.url) return handleError(res, 501, "getting error while uploading...");

		const newPost = new postModel({
			userId: _id,
			image: cloudinaryURL.url,
			mediaPublicId: cloudinaryURL.public_id,
			location,
			caption
		})

		await newPost.save();
		// await redisClient.del("allPosts");
		return handleSuccess(res, 201, "✅ Post created Successfully!!!")
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`)
	}
}

const getAllPosts = async (req, res) => {
	const { _id } = req.user;
	try {
		const user = await userModel.findById(_id).select("-password");
		if (!user) return handleError(res, 401, "user not found!!!");

		// commented becuase of redisMiddleware, if not use middleware then uncomment this and use it
		// const cachedData = await redisClient.get("allPosts");

		// if (cachedData) {
		// 	return res.status(200).json({
		// 		message: "posts fetched success",
		// 		success: true,
		// 		allPost: JSON.parse(cachedData)
		// 	});
		// }


		const allPost = await postModel.find().populate("userId", "_id username profilePicture");

		// await redisClient.setEx("allPosts", 3600, JSON.stringify(allPost));

		// await redisClient.setEx(res.locals.cacheKey || "post:all", 3600, JSON.stringify(allPost));

		return handleSuccess(res, 200, "", { allPost });
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const updatePost = async (req, res) => {
	const { _id } = req.user;
	const { postId } = req.params;
	const { image, location, caption } = req.body;

	try {
		const user = await userModel.findById(_id);
		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");

		const post = await postModel.findById(postId);

		if (!post) return handleError(res, 404, "Post not found!!!");

		post.image = image;
		post.location = location;
		post.caption = caption;
		post.updatedAt = Date.now();
		await post.save();

		// await redisClient.del("allPosts");
		// await redisClient.del(`post:${postId}`);
		return handleSuccess(res, 200, "✅ Post Updated Successfully!!!")
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const postDelete = async (req, res) => {
	const { _id } = req.user;
	const { postId } = req.params;
	try {
		const user = await userModel.findById(_id);
		if (!user) return handleError(res, 404, "User not found!!!, Login first!!!!");

		const post = await postModel.findById(postId);
		if (!post) return handleError(res, 404, "Post not found!!!");

		if (post.userId.toString() !== user._id.toString()) return handleError(res, 500, "You are not allowed to delete the post!!!");

		if (post?.mediaPublicId) {
			await cloudinary.uploader.destroy(post?.mediaPublicId);
		}

		await postModel.findByIdAndDelete(postId);

		// await redisClient.del("allPosts");
		// await redisClient.del(`post:${postId}`);

		return handleSuccess(res, 200, "✅ Post Deleted Successfully!!!")
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const getSinglePost = async (req, res) => {
	const { postId } = req.params;
	const { _id } = req.user;
	try {
		const user = await userModel.findById(_id);
		if (!user) return handleError(res, 404, "User not found!!!, Login first!!");

		// commented becuase of redisMiddleware, if not use middleware then uncomment this and use it
		// const cacheKey = `post:${postId}`;
		// const cachedPost = await redisClient.get(cacheKey);

		// if (cachedPost) {
		// 	return res.status(200).json({
		// 		message: "Post found successfully from cache",
		// 		success: true,
		// 		post: JSON.parse(cachedPost)
		// 	})
		// }

		const post = await postModel.findById(postId);

		if (!post) return handleError(res, 404, "Post not found!!!");

		// await redisClient.setEx(cacheKey, 3600, JSON.stringify(post));
		// await redisClient.setEx(res.locals.cacheKey || `post:${postId}`, 3600, JSON.stringify(post));

		return handleSuccess(res, 200, "", { post })
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

export { createPost, updatePost, postDelete, getAllPosts, getSinglePost };