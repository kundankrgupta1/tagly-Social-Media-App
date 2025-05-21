import dotenv from "dotenv"
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars"
import path from "path"
dotenv.config()

const sendEmail = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
})

sendEmail.use(
	"compile",
	hbs({
		viewEngine: {
			extname: ".hbs",
			defaultLayout: false,
		},
		viewPath: path.resolve("views"),
		extName: ".hbs",
	})
)

const sendOtp = async (email, otp, purpose, username) => {
	console.log("username", username);
	
	await sendEmail.sendMail({
		to: email,
		subject: `otp for ${purpose}`,
		template: "otp",
		context: {
			otp: otp,
			purpose: purpose,
			username: username
		},
	})
}

export default sendOtp
