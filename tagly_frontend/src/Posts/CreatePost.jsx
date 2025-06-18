import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Input } from "../Components/InputFeild";
import Button from "../Components/Button";
import Loading from "../Components/Loading";
import axiosInstance from "../utils/axiosInstance";
import useToast from "../Hooks/useToast";
import Toast from "../Components/Toast";

const CreatePost = () => {
	const inputRef = useRef(null);
	const navigate = useNavigate();
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { toast, showToast } = useToast();
	const handleCreatePost = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData();
		formData.append("caption", caption);
		formData.append("location", location);
		formData.append("image", image);

		if (!caption || !location || !image) {
			setIsLoading(false);
			showToast(true, "All fields are required!", "error");
			return;
		}
		
		try {
			const res = await axiosInstance.post(`/post`, formData, {
				withCredentials: true,
				headers: {
					ContentType: "multipart/form-data",
				}
			});
			setIsLoading(false);
			if (res.status === 201) {
				showToast(true, res.data.message, "success");
				setCaption("");
				setLocation("");
				setImage(null);
				setTimeout(() => {
					navigate("/");
				}, 2000);
			}
		} catch (error) {
			setIsLoading(false);
			showToast(true, error.response?.data?.message || "Something went wrong!", "error");
		}
	};
	useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [])
	return (
		<div className="m-auto md:border md:w-2/4 rounded-lg shadow-xl p-6 relative">
			<h1 className="text-2xl font-semibold">Create a Post</h1>

			<form onSubmit={handleCreatePost} className="flex flex-col gap-4">
				<div className="flex flex-col">
					<label className="text-lg font-medium" htmlFor="location">Location</label>
					<Input
						ref={inputRef}
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
			{toast.isOpen && <Toast toast={toast} />}
		</div>
	);
};

export default CreatePost;
