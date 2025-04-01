import { useContext, useEffect, useRef, useState } from "react"
import { ContextAPI } from "../context/ContextProvider"
import axios from "axios";
import { SERVER_URI } from "../App";
import Button from "../Components/Button";
import { FaCheck } from "react-icons/fa";
import { Input } from "../Components/InputFeild";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Components/Loading";
import { CgClose } from "react-icons/cg";

const EditProfile = () => {
	const _id = useParams();
	const navigate = useNavigate();
	const { loggedInUser, token } = useContext(ContextAPI);
	const imageRef = useRef(null);
	const [userData, setUserData] = useState(null);
	const [updateProfilePicture, setUpdateProfilePicture] = useState(null);
	const [updataUsername, setUpdataUsername] = useState("");
	const [updataBio, setUpdataBio] = useState("");
	const [popup, setPopup] = useState(false);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchUser = async () => {
		try {
			const res = await axios.get(`${SERVER_URI}/user/${loggedInUser}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUserData(res.data.data);
			setUpdateProfilePicture(res.data.data?.profilePicture || null);
			setUpdataUsername(res.data.data?.username || "");
			setUpdataBio(res.data.data?.bio || "");
		} catch (error) {
			setError(error.response.data.message);
		}
	};
	const updateProfile = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const formData = new FormData();
			if (imageRef.current.files[0]) {
				const file = imageRef.current.files[0];
				const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];

				if (!allowedExtensions.includes(file.type)) {
					imageRef.current.value = "";
					setIsLoading(false);
					setError("❌ Only jpg, jpeg, and png file types are allowed!");
					setPopup(true);
					setTimeout(() => {
						setPopup(false);
						setError("");
					}, 2000);
					return;
				}

				formData.append("profilePicture", file);
			}
			if (updataUsername.trim()) formData.append("username", updataUsername);
			if (updataBio.trim()) formData.append("bio", updataBio);

			const res = await axios.put(`${SERVER_URI}/edit/${_id._id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data"
				},
			})
			setIsLoading(false);
			if (res.data.success) {
				setPopup(true);
				setMessage(res.data.message);
				localStorage.removeItem("profilePicture");
				localStorage.removeItem("username");
				localStorage.setItem("profilePicture", res.data.data.profilePicture);
				localStorage.setItem("username", res.data.data.username);
			}
			setTimeout(() => {
				if (res.data.success) {
					setPopup(false);
					setMessage("");
					navigate(`/api/v1/user/profile/${_id._id}`);
					window.location.reload();
				}
			}, 2000)
		} catch (error) {
			setIsLoading(false);
			setError(error.response.data.message || "Something went wrong.");
			setPopup(true);
			setTimeout(() => {
				setPopup(false);
				setError("");
			}, 2000)
		}
	}

	useEffect(() => {
		if (userData) {
			setUpdateProfilePicture(userData?.profilePicture);
			setUpdataUsername(userData?.username);
			setUpdataBio(userData?.bio);
		} else {
			setUpdateProfilePicture(null);
			setUpdataUsername("");
			setUpdataBio("");
		}
		fetchUser();
	}, [])

	return (
		<>
			<div className="w-2/4 m-auto">
				<form onSubmit={updateProfile}>
					<div className="flex items-center gap-4 mb-4">
						<div
							onClick={() => imageRef.current.click()}
							className="w-2/4 h-40 cursor-pointer flex justify-center items-center mb-4 md:mb-0"
						>
							{updateProfilePicture ? (
								<img src={updateProfilePicture} alt="upload_icon" className="w-40 h-40 rounded-full object-cover" />
							) : (
								<img src="https://tinyurl.com/5paj2hrp" alt="upload_icon" className="w-40 h-40 rounded-full object-cover grayscale" />
							)}
							<input
								type="file"
								className="hidden"
								ref={imageRef}
								onChange={(e) => setUpdateProfilePicture(URL.createObjectURL(e.target.files[0]))}
							/>
						</div>
						<Input
							type={"text"}
							style={"w-2/4"}
							value={updataUsername}
							placeholder={"username"}
							onChange={(e) => setUpdataUsername(e.target.value)}
						/>
					</div>
					<textarea
						value={updataBio}
						onChange={(e) => setUpdataBio(e.target.value)}
						placeholder="Write your bio here..."
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
					></textarea>
					<div className="mt-4 flex items-center gap-4">
						<Button
							type={"submit"}
							icon={!isLoading && <FaCheck size={"1.5rem"} />}
							text={isLoading ? <Loading text={"Updating..."} /> : "save"}
						/>
						<Button
							type={"button"}
							icon={<CgClose size={"1.5rem"} />}
							text={"cancel"}
							onClick={() => navigate(`/api/v1/user/profile/${_id._id}`)}
						/>
					</div>

				</form>
			</div>
			{
				popup &&
				(
					<div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
						<div
							className={`transform transition-transform duration-300 ease-in-out ${popup ? 'translate-y-0' : 'translate-y-full'
								} ${message ? "bg-green-300" : error ? "bg-red-300" : "bg-white"} p-6 shadow-lg rounded-t-lg w-full max-w-md sm:max-w-lg`}
						>
							{message && (
								<div className="w-fit mt-4 bg-green-300 rounded-sm text-black px-3 py-1">
									<p className="text-center">{message}</p>
								</div>
							)}
							{error && (
								<div className="w-fit mt-4 bg-red-300 rounded-sm text-black px-3 py-1">
									<p className="text-center">{error}</p>
								</div>
							)}
						</div>
					</div>
				)
			}
		</>
	)
}

export default EditProfile