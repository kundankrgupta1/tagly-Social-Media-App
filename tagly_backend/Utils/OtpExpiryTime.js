import dotenv from "dotenv"
dotenv.config();
const OtpExpiryTime = () => {
	return new Date(Date.now() + process.env.OTP_EXPIRY_TIME * 60 * 1000);
}

export default OtpExpiryTime;
