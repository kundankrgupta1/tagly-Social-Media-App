import { Input } from "../Components/InputFeild"
import { PiUserCirclePlusBold } from "react-icons/pi";
import Button from "../Components/Button";
import { useContext, useEffect, useRef, useState } from "react";
import Loading from "../Components/Loading";
import { FaCheck } from "react-icons/fa";
import { ContextAPI } from "../context/ContextProvider";
import axiosInstance from "../utils/axiosInstance";
import useToast from "../Hooks/useToast";
import Toast from "../Components/Toast";

const Register = () => {
	const inputRef = useRef(null);
	const { toast, showToast } = useToast();
	const { setToggle } = useContext(ContextAPI);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const handleRegister = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (!otpSent) {
			try {
				const res = await axiosInstance.post(`/reg`, { username, email, password });
				if (res.status === 201) {
					showToast(true, res.data.message, "success");
					setTimeout(() => {
						setOtpSent(true);
					}, 2000);
				}
			} catch (error) {
				showToast(true, error.response.data.message, "error");
			} finally{
				setIsLoading(false);
			}
		} else {
			try {
				setIsLoading(true);
				const res = await axiosInstance.post(`/otp`, { email, otp });
				if (res.status === 200) {
					showToast(true, res.data.message, "success");
					setTimeout(() => {
						setOtpSent(false);
						setToggle(false);
					}, 2000);
				}
			} catch (error) {
				showToast(true, error.response.data.message, "error");
			} finally {
				setIsLoading(false);
			}
		}

	}
	useEffect(() => { if (!otpSent && inputRef.current) inputRef.current.focus(); }, [otpSent])
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-bold text-center mb-4">{!otpSent ? "Register" : "Verify"}</h1>
			<form onSubmit={handleRegister} className="flex flex-col gap-4">
				{!otpSent && <Input
					ref={inputRef}
					type="text"
					value={username}
					placeholder="Username"
					required={true}
					onChange={(e) => setUsername(e.target.value)}
				/>}
				{!otpSent && <Input
					type="email"
					value={email}
					placeholder="Email"
					required={true}
					onChange={(e) => setEmail(e.target.value)}
				/>}
				{!otpSent ?
					<Input
						type="password"
						value={password}
						placeholder="Password"
						required={true}
						onChange={(e) => setPassword(e.target.value)}
					/>
					:
					<Input
						type="text"
						value={otp}
						placeholder="Enter OTP"
						required={true}
						onChange={(e) => setOtp(e.target.value)}
					/>}
				{!otpSent ?
					<Button
						type="submit"
						icon={!isLoading && <PiUserCirclePlusBold size={"1.5rem"} />}
						text={isLoading ? <Loading text={"OTP sending..."} /> : "register"}
						style={"border-2"}
					/>
					:
					<Button
						type="submit"
						icon={!isLoading && <FaCheck size={"1.5rem"} />}
						text={isLoading ? <Loading text={"verifying..."} /> : "rerify"}
						style={"border-2"}
					/>
				}
			</form>
			{toast?.isOpen && <Toast toast={toast} />}
		</div>
	)
}

export default Register