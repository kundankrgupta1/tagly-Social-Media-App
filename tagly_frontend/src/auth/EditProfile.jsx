"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { ContextAPI } from "../context/ContextProvider"
import { FaCheck, FaCamera, FaUser } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { CgClose } from "react-icons/cg"
import axiosInstance from "../utils/axiosInstance"
import useToast from "../Hooks/useToast"
import Toast from "../Components/Toast"

const EditProfile = () => {
	const { toast, showToast } = useToast()
	const { _id } = useParams()
	const navigate = useNavigate()
	const { user, setUser } = useContext(ContextAPI)
	const imageRef = useRef(null)
	const inputRef = useRef(null)

	const [userData, setUserData] = useState(null)
	const [updateProfilePicture, setUpdateProfilePicture] = useState(null)
	const [updataUsername, setUpdataUsername] = useState("")
	const [updataBio, setUpdataBio] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [imagePreview, setImagePreview] = useState(null)

	const fetchUser = async () => {
		try {
			const res = await axiosInstance.get(`/user/${user?._id}`, { withCredentials: true })
			if (res.status === 200) {
				const data = res.data.data
				setUserData(data)
				setUpdateProfilePicture(data.profilePicture || null)
				setUpdataUsername(data.username || "")
				setUpdataBio(data.bio || "")
			}
		} catch (error) {
			showToast(true, error?.response?.data?.message, "error")
		}
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (!file) return

		const allowed = ["image/jpeg", "image/jpg", "image/png"]
		if (!allowed.includes(file.type)) {
			imageRef.current.value = ""
			showToast(true, "❌ Only jpg, jpeg, and png file types are allowed!", "error")
			return
		}

		const preview = URL.createObjectURL(file)
		setImagePreview(preview)
		setUpdateProfilePicture(preview)
	}

	const updateProfile = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const formData = new FormData()
			const file = imageRef.current?.files[0]
			if (file) {
				const allowed = ["image/jpeg", "image/jpg", "image/png"]
				if (!allowed.includes(file.type)) {
					imageRef.current.value = ""
					showToast(true, "❌ Only jpg, jpeg, and png file types are allowed!", "error")
					return
				}
				formData.append("profilePicture", file)
			}
			if (updataUsername.trim()) formData.append("username", updataUsername)
			if (updataBio.trim()) formData.append("bio", updataBio)

			const res = await axiosInstance.put(`/edit/${_id}`, formData, { withCredentials: true })
			if (res.status === 200) {
				setUser(res.data.user)
				localStorage.setItem("user", JSON.stringify(res.data.user))
				showToast(true, res.data.message, "success")
				setTimeout(() => navigate(`/profile/${_id}`), 2000)
			}
		} catch (error) {
			showToast(true, error.response?.data?.message || "Something went wrong.", "error")
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus()
	}, [])

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8">
			<form
				onSubmit={updateProfile}
				className="max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-200"
			>
				{/* Profile Image Section */}
				<div className="flex flex-col items-center mb-8">
					<div onClick={() => imageRef.current.click()} className="relative group cursor-pointer w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-200 hover:border-blue-400 overflow-hidden transition">
						{updateProfilePicture ? (
							<img
								src={updateProfilePicture}
								alt="Profile"
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gray-100">
								<FaUser className="w-12 h-12 text-gray-400" />
							</div>
						)}

						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition">
							<div className="opacity-0 group-hover:opacity-100">
								<div className="bg-white bg-opacity-90 rounded-full p-3">
									<FaCamera className="w-6 h-6 text-gray-700" />
								</div>
							</div>
						</div>
					</div>

					<input
						ref={imageRef}
						type="file"
						accept="image/jpeg,image/jpg,image/png"
						className="hidden"
						onChange={handleImageChange}
					/>

					<button
						type="button"
						onClick={() => imageRef.current.click()}
						className="mt-4 text-blue-500 hover:text-blue-600 font-medium text-sm"
					>
						Change Profile Photo
					</button>
				</div>

				{/* Username */}
				<label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
				<div className="relative mb-6">
					<input
						ref={inputRef}
						type="text"
						value={updataUsername}
						onChange={(e) => setUpdataUsername(e.target.value)}
						placeholder="Enter your username"
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
					/>
					<FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
				</div>
				<p className="text-xs text-gray-500 mb-4">Your username is how others will find and mention you.</p>

				{/* Bio */}
				<label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
				<textarea
					value={updataBio}
					onChange={(e) => setUpdataBio(e.target.value)}
					placeholder="Write a little about yourself..."
					rows={4}
					maxLength={150}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none mb-2"
				/>
				<div className="flex justify-between text-xs text-gray-500 mb-6">
					<p>Tell people a little about yourself.</p>
					<span>{updataBio.length}/150</span>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
					<button
						type="submit"
						disabled={isLoading}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg transition disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Updating...</span>
							</>
						) : (
							<>
								<FaCheck className="w-4 h-4" />
								<span>Save Changes</span>
							</>
						)}
					</button>

					<button
						type="button"
						onClick={() => navigate(`/profile/${_id}`)}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
					>
						<CgClose className="w-4 h-4" />
						<span>Cancel</span>
					</button>
				</div>
			</form>

			{toast?.isOpen && <Toast toast={toast} />}
		</div>
	)
}

export default EditProfile
