import { useContext, useState, useRef, useEffect } from "react";
import { Input } from "../Components/InputFeild"
import { IoMdLogIn } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Button from "../Components/Button";
import { ContextAPI } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import axiosInstance from "../utils/axiosInstance";
import useToast from "../Hooks/useToast";
import Toast from "../Components/Toast";

const Login = () => {
	const inputRef = useRef(null);
	const { toast, showToast } = useToast();
	const { setIsAuth, setUser } = useContext(ContextAPI);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const handleLogin = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (!otpSent) {
			try {
				const res = await axiosInstance.post(`/login`, { email, password });
				if (res.status === 200) {
					showToast(true, res.data.message, "success");
					setTimeout(() => {
						setOtpSent(true);
					}, 2000)
				}
			} catch (error) {
				showToast(true, error.response.data.message, "error");
			} finally {
				setIsLoading(false);
			}
		} else {
			try {
				setIsLoading(true);
				const res = await axiosInstance.post(`/otp`, { email, otp });
				if (res.status === 200) {
					showToast(true, res.data.message, "success");
					setIsAuth(true);
					setUser(res.data.user);
					localStorage.setItem("user", JSON.stringify(res.data.user));
					setTimeout(() => {
						setOtpSent(false);
						navigate("/");
					}, 2000);
				}
			} catch (error) {
				showToast(true, error.response.data.message, "error");
			} finally {
				setIsLoading(false);
			}
		}

	}

	useEffect(() => {
		if (!otpSent && inputRef.current) inputRef.current.focus();
	}, [otpSent])

	return (
		<div className="flex justify-center items-center">
			<div></div>
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-bold text-center mb-4">{!otpSent ? "Login" : "Verify"}</h1>
				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					{!otpSent && <Input
						ref={inputRef}
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
							icon={!isLoading && <IoMdLogIn size={"1.5rem"} />}
							text={isLoading ? <Loading text={"OTP sending..."} /> : "login"}
							style={"border-2"}
						/>
						:
						<Button
							type="submit"
							icon={!isLoading && <FaCheck size={"1.5rem"} />}
							text={isLoading ? <Loading text={"verifying..."} /> : "verify"}
							style={"border-2"}
						/>
					}
				</form>
				{toast?.isOpen && <Toast toast={toast} />}
			</div>
		</div>
	)
}

export default Login