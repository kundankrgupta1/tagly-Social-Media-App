import { useEffect, useRef, useState } from "react"
import { IoIosSend } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { Input } from "../Components/InputFeild"
import Loading from "../Components/Loading"
import axiosInstance from "../utils/axiosInstance"
import useToast from "../Hooks/useToast"
import Toast from "../Components/Toast"

const CreatePost = () => {
	const inputRef = useRef(null)
	const navigate = useNavigate()
	const [caption, setCaption] = useState("")
	const [location, setLocation] = useState("")
	const [image, setImage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [imagePreview, setImagePreview] = useState(null)
	const { toast, showToast } = useToast()

	const handleCreatePost = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		const formData = new FormData()
		formData.append("caption", caption)
		formData.append("location", location)
		formData.append("image", image)

		if (!caption || !location || !image) {
			setIsLoading(false)
			showToast(true, "All fields are required!", "error")
			return
		}

		try {
			const res = await axiosInstance.post(`/post`, formData, {
				withCredentials: true,
				headers: {
					ContentType: "multipart/form-data",
				},
			})
			setIsLoading(false)
			if (res.status === 201) {
				showToast(true, res.data.message, "success")
				setCaption("")
				setLocation("")
				setImage(null)
				setImagePreview(null)
				setTimeout(() => {
					navigate("/")
				}, 2000)
			}
		} catch (error) {
			setIsLoading(false)
			showToast(true, error.response?.data?.message || "Something went wrong!", "error")
		}
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			setImage(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				setImagePreview(reader.result)
			}
			reader.readAsDataURL(file)
		}
	}

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus()
	}, [])

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
						Create Cosmic Post
					</h1>
					<p className="text-gray-400">Share your story with the universe</p>
				</div>

				{/* Main Form Card */}
				<div className="relative shadow-2xl overflow-hidden">
					<div className="absolute inset-0 animate-pulse"></div>
					<div className="relative z-10 p-8">
						<form onSubmit={handleCreatePost} className="space-y-8">
							<div className="space-y-4">
								<label className="block text-lg font-semibold text-black mb-4">📸 Visual Story</label>

								{!imagePreview ? (
									<div
										className="relative border-2 border-dashed border-purple-500/50 rounded-2xl p-12 text-center hover:border-purple-500 transition-all duration-300 cursor-pointer group"
										onClick={() => document.getElementById("image-upload").click()}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
										<div className="relative z-10">
											<div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
												<span className="text-3xl">📷</span>
											</div>
											<h3 className="text-xl font-semibold text-white mb-2">Upload Your Masterpiece</h3>
											<p className="text-gray-400">Click to select an image that tells your story</p>
										</div>
									</div>
								) : (
									<div className="relative rounded-2xl overflow-hidden group">
										<img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
										<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
											<button
												type="button"
												onClick={() => {
													setImage(null)
													setImagePreview(null)
												}}
												className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
											>
												Remove
											</button>
										</div>
									</div>
								)}

								<input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
							</div>

							<div className="space-y-4">
								<label className="block text-lg font-semibold text-black">📍 Location</label>
								<div className="relative">
									<Input
										ref={inputRef}
										type="text"
										placeholder="Where in the universe are you?"
										value={location}
										onChange={(e) => setLocation(e.target.value)}
									// style="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
									/>
									<div className="absolute inset-0 rounded-xl pointer-events-none"></div>
								</div>
							</div>

							<div className="space-y-4">
								<label className="block text-lg font-semibold text-black">✨ Your Story</label>
								<div className="relative">
									<textarea
										placeholder="What cosmic thoughts are you sharing today?"
										className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none h-32 text-black placeholder-gray-400 transition-all duration-300"
										value={caption}
										onChange={(e) => setCaption(e.target.value)}
									></textarea>
									<div className="absolute inset-0 rounded-xl pointer-events-none"></div>
									<div className="absolute bottom-3 right-3 text-xs text-gray-400">{caption.length}/500</div>
								</div>
							</div>

							<div className="flex justify-center pt-4">
								<button
									type="submit"
									disabled={isLoading}
									className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div className="relative flex items-center justify-center gap-2">
										{isLoading ? (
											<Loading text="Launching to space..." />
										) : (
											<>
												<IoIosSend size="1.5rem" />
												<span>Create Post</span>
											</>
										)}
									</div>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			{toast.isOpen && <Toast toast={toast} />}
		</div>
	)
}

export default CreatePost
