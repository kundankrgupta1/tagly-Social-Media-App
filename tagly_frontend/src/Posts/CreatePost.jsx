import axios from "axios";
import { useContext, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Input } from "../Components/InputFeild";
import { ContextAPI } from "../context/ContextProvider";
import { SERVER_URI } from "../App";
import Button from "../Components/Button";
import Loading from "../Components/Loading";

const CreatePost = () => {
	const navigate = useNavigate();
	const { token } = useContext(ContextAPI);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const handleCreatePost = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (caption.trim() && location.trim()) {
				const formData = new FormData();
				formData.append("location", location);
				formData.append("caption", caption);
				formData.append("image", image);

				const res = await axios.post(`${SERVER_URI}/post`, formData, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					}
				}
				);
				setMessage(res.data.message);
				setTimeout(() => {
					setMessage(null);
					navigate("/");
				}, 2000);
			} else {
				setMessage("Please fill in all fields");
			}
			setIsLoading(false);
		} catch (error) {
			console.error("Error:", error);
			setError(error);
			setMessage(error.response?.data?.message || "Something went wrong!");
			setIsLoading(false);
		}
	};
	return (
		<div className="m-auto md:border md:w-2/4 rounded-lg shadow-xl p-6 relative">
			<h1 className="text-2xl font-semibold">Create a Post</h1>

			<form onSubmit={handleCreatePost} className="flex flex-col gap-4">
				<div className="flex flex-col">
					<label className="text-lg font-medium" htmlFor="location">Location</label>
					<Input
						type="text"
						placeholder="Add location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-lg font-medium">Upload Image</label>
					<input
						type="file"
						className="w-full p-2 border rounded-md"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
					/>
					{image && <p className="text-sm text-green-600 mt-2">{image.name}</p>}
				</div>

				<div className="flex flex-col">
					<label className="text-lg font-medium">Description</label>
					<textarea
						placeholder="What's on your mind?"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
						value={caption}
						name="description"
						onChange={(e) => setCaption(e.target.value)}
					></textarea>
				</div>

				<Button
					type={"submit"}
					icon={!isLoading && <IoIosSend size={"1.5rem"} />}
					text={isLoading ? <Loading text={"posting..."} /> : "post"}
					style={"capitalize w-fit border-2 font-bold border-blue-600 text-blue-600 hover:text-white"}
				>
				</Button>
			</form>
			{/* message */}
			{message && <p className="text-md text-green-800 mt-2">{message}</p>}
			{error && <p className="text-md text-red-600 mt-2">{error.message}</p>}
		</div>
		// </div>
	);
};

export default CreatePost;
