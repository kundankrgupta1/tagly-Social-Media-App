import { useContext, useEffect, useRef, useState } from "react"
import { ContextAPI } from "../context/ContextProvider"
import Button from "../Components/Button";
import { FaCheck } from "react-icons/fa";
import { Input } from "../Components/InputFeild";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Components/Loading";
import { CgClose } from "react-icons/cg";
import axiosInstance from "../utils/axiosInstance";
import useToast from "../Hooks/useToast";
import Toast from "../Components/Toast";

const EditProfile = () => {
	const { toast, showToast } = useToast();
	const _id = useParams();
	const navigate = useNavigate();
	const { user } = useContext(ContextAPI);
	const imageRef = useRef(null);
	const inputRef = useRef(null);
	const [userData, setUserData] = useState(null);
	const [updateProfilePicture, setUpdateProfilePicture] = useState(null);
	const [updataUsername, setUpdataUsername] = useState("");
	const [updataBio, setUpdataBio] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const fetchUser = async () => {
		try {
			const res = await axiosInstance.get(`/user/${user?._id}`, { withCredentials: true });
			if (res.status === 200) {
				setUserData(res.data.data);
				setUpdateProfilePicture(res.data.data?.profilePicture || null);
				setUpdataUsername(res.data.data?.username || "");
				setUpdataBio(res.data.data?.bio || "");
			}
		} catch (error) {
			showToast(true, error?.response?.data?.message, "error");
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
					showToast(true, "❌ Only jpg, jpeg, and png file types are allowed!", "error");
					return;
				}
				formData.append("profilePicture", file);
			}
			if (updataUsername.trim()) formData.append("username", updataUsername);
			if (updataBio.trim()) formData.append("bio", updataBio);

			const res = await axiosInstance.put(`/edit/${_id._id}`, formData, { withCredentials: true });
			setIsLoading(false);
			if (res.status === 200) {
				showToast(true, res.data.message, "success");
				localStorage.removeItem("profilePicture");
				localStorage.removeItem("username");
				localStorage.setItem("profilePicture", res.data.data.profilePicture);
				localStorage.setItem("username", res.data.data.username);
				setTimeout(() => {
					navigate(`/api/v1/user/profile/${_id._id}`);
				}, 2000)
			}
		} catch (error) {
			setIsLoading(false);
			showToast(true, error.response.data.message || "Something went wrong.", "error");
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

	useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [])
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
							ref={inputRef}
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
			{toast?.isOpen && <Toast toast={toast} />}
		</>
	)
}

export default EditProfile