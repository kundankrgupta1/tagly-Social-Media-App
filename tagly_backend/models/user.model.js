import mongoose from "mongoose";
const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
			lowercase: true
		},
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			match: [/^[a-zA-Z0-9_.-]*$/, 'Invalid characters in username'],
			lowercase: true
		},
		password: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
			maxLength: 160,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		otpPurpose: {
			type: String,
			default: ""
		},
		otp: {
			type: String,
		},
		otp_expiry: {
			type: Date
		}
	}, { timestamps: true }
)

const userModel = mongoose.model("User", userSchema)

export default userModel;
