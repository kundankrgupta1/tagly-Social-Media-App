import userModel from "../models/user.model.js";
import generateOTP from "../Utils/generateOTP.js";
import bcrypt from "bcrypt";
import postModel from "../models/post.model.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import Tokens from "../Utils/Tokens.js";
import sendOtp from "../Utils/mailer.js";
import Options from "../Utils/Options.js";
import OtpExpiryTime from "../Utils/OtpExpiryTime.js";
import { handleError, handleSuccess } from "../Utils/responseHandler.js";


const userRegistration = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) return handleError(res, 400, "❌ all fileds are required!!!!");

		const user = await userModel.findOne({ email }).select("-password");
		const userByUsername = await userModel.findOne({ username }).select("-password");

		if (user && user.isVerified) return handleError(res, 409, "✅ user already exist and verified!, Please Login")

		if (user && userByUsername && !user.isVerified) {
			const otp = generateOTP();
			const otp_expiry = OtpExpiryTime();
			user.otp = otp;
			user.otp_expiry = otp_expiry;
			user.otpPurpose = "Verification";
			user.isVerified = false;

			await sendOtp(email, otp, "Verification", user.username)
			await user.save();

			return handleSuccess(res, 201, "❌ user found but not verified, otp send for Verification")
		}

		if (userByUsername) return handleError(res, 409, "❌ username already taken, Please choose another");

		const otp = generateOTP();
		const otp_expiry = OtpExpiryTime();

		const hashPass = await bcrypt.hash(password, 10);

		const newUser = new userModel({
			username,
			email,
			password: hashPass,
			otp,
			otp_expiry,
			otpPurpose: "Registration",
			isVerified: false
		});

		await sendOtp(email, otp, "Registration", username)
		await newUser.save();

		return handleSuccess(res, 201, `✅ otp sent for Registration ${otp}`)
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`)
	}
}

const userLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) return handleError(res, 400, `❌ all fileds are required!!!!`);

		const user = await userModel.findOne({ email })

		if (!user) return handleError(res, 404, "❌ User not found, Please register first!!!");

		const checkPass = await bcrypt.compare(password, user.password);

		if (!checkPass) return handleError(res, 404, "❌ Invalid credentials!");

		if (!user.isVerified) {
			const otp = generateOTP();
			const otp_expiry = OtpExpiryTime();
			user.otp = otp;
			user.otp_expiry = otp_expiry;
			user.otpPurpose = "Verification";
			user.isVerified = false

			await sendOtp(email, otp, "Verification", user.username)
			await user.save();

			return handleSuccess(res, 200, `❌ user found but not verified, otp send for Verification ${otp}`)
		}

		const otp = generateOTP();
		const otp_expiry = OtpExpiryTime();
		user.otp = otp;
		user.otp_expiry = otp_expiry;
		user.otpPurpose = "Login";

		await sendOtp(email, otp, "Login", user.username)
		await user.save();

		return handleSuccess(res, 200, `✅ otp sent for Login ${otp}`);
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`)
	}
}

const verifyOtp = async (req, res) => {
	const { email, otp } = req.body;
	try {
		const user = await userModel.findOne({ email }).select("-password");

		if (!user) return handleError(res, 404, "❌ User not found");

		if (Date.now() > user.otp_expiry || user.otp.toString() !== otp.toString()) return handleError(res, 401, "❌ Invalid OTP");

		const otpPurpose = user.otpPurpose;
		let accessToken, refreshToken;
		if (otpPurpose === "Login") {
			accessToken = Tokens.generateAccessToken({ _id: user._id });
			refreshToken = Tokens.generateRefreshToken({ _id: user._id });
		}

		user.isVerified = true;
		user.otp = undefined;
		user.otp_expiry = undefined;
		user.otpPurpose = undefined;

		if (otpPurpose === "Login") {
			user.refreshToken = refreshToken;
			res.cookie("accessToken", accessToken, Options());
			res.cookie("refreshToken", refreshToken, Options("refreshToken"));
		}
		await user.save();

		return handleSuccess(res, 200, `✅ ${otpPurpose} successful!`, { user: otpPurpose === "Login" ? { _id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture } : undefined })
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`)
	}
}

const refreshTokenRoute = async (req, res) => {
	try {
		const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

		if (!refreshToken) return handleError(res, 401, "❌ refreshToken not provided or expired!", { logoutRequired: true });

		const decoded = Tokens.VerifyToken(refreshToken, "refreshToken");
		const user = await userModel.findById(decoded._id).select("-password");

		if (!user || refreshToken !== user.refreshToken) {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
			user.refreshToken = undefined;
			await user.save();
			return handleError(res, 401, "❌ Invalid refresh token!", { logoutRequired: true });
		}

		const newAccessToken = Tokens.generateAccessToken({ _id: user._id });
		const newRefreshToken = Tokens.generateRefreshToken({ _id: user._id });

		user.refreshToken = newRefreshToken;
		await user.save();

		res.cookie("accessToken", newAccessToken, Options());
		res.cookie("refreshToken", newRefreshToken, Options("refreshToken"));
		return handleSuccess(res, 200, "✅ Tokens Refreshed successfully!", { token: newAccessToken });
	} catch (error) {
		return handleError(res, 401, "⚠️ Error: ${error.message}", { logoutRequired: true });
	}
}

const userLogout = async (req, res) => {
	const { _id } = req.user;
	try {
		const user = await userModel.findById(_id).select("-password -otp -otp_expiry -otpPurpose -isVerified -followers -following -bio -profilePicture -createdAt -updatedAt")

		if (!user) return handleError(res, 404, "❌ User not found");

		user.refreshToken = undefined;
		await user.save();

		res.clearCookie("accessToken", Options("logout"));
		res.clearCookie("refreshToken", Options("logout"));

		return handleSuccess(res, 200, "✅ Logout successfully!");
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const getUser = async (req, res) => {
	const { _id } = req.params;
	try {
		const user = await userModel.findById(_id).select("-password");
		if (!user) return handleError(res, 404, `❌ User not found!`);

		const totalPost = await postModel.find({ userId: _id })
		const postLength = totalPost.length;

		return handleSuccess(res, 200, "", {
			data: {
				_id: user._id,
				username: user.username,
				email: user.email,
				profilePicture: user.profilePicture,
				bio: user.bio,
				isVerified: user.isVerified,
				followers: user.followers,
				following: user.following,
				postLength,
				totalPost
			}
		});
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

const updateProfile = async (req, res) => {
	const { _id } = req.params;
	const { username, bio } = req.body;

	try {
		const user = await userModel.findById(_id).select("-password");

		if (!user) handleError(res, 404, `❌ User not found!`);

		if (req.file) {
			const allowed = ["image/png", "image/jpeg", "image/jpg"];
			if (!allowed.includes(req.file.mimetype)) return handleError(res, 400, "❌ Only jpg, jpeg, and png file types are allowed!");

			const cloudinaryURL = await uploadOnCloudinary(req.file.path);

			if (!cloudinaryURL?.url) return handleError(res, 500, `❌ error while uploading image on cloudinary`);
			user.profilePicture = cloudinaryURL.url;
		}

		if (username && username !== user.username) {
			const existingUsername = await userModel.findOne({ username });
			if (existingUsername) return handleError(res, 409, "❌ username already taken, Please choose another");
			user.username = username;
		}

		if (bio) user.bio = bio;
		await user.save();

		return handleSuccess(res, 200, "✅ profile updated successfully!", { data: user });
	} catch (error) {
		return handleError(res, 500, `⚠️ Error: ${error.message}`);
	}
}

export { userRegistration, userLogin, verifyOtp, refreshTokenRoute, userLogout, getUser, updateProfile };
