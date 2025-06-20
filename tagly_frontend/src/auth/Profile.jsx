import { useContext, useEffect, useState } from "react"
import { ContextAPI } from "../context/ContextProvider"
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";
import { FaUserEdit } from "react-icons/fa";
import Loading from "../Components/Loading";
import { IoMdLogOut } from "react-icons/io";
import SinglePost from "./SinglePost";
import axiosInstance from "../utils/axiosInstance";
import Toast from "../Components/Toast";
import useToast from "../Hooks/useToast";

const Profile = () => {
	const { isAuth, setIsAuth, user } = useContext(ContextAPI)
	const { _id } = useParams();
	const navigate = useNavigate();
	const { toast, showToast } = useToast();
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [singlePostView, setSinglePostView] = useState(false);
	const fetchUser = async () => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`/user/${_id}`, { withCredentials: true });
			if (res.status === 200) {
				setUserData(res.data.data);
			}
		} catch (error) {
			showToast(true, error.response.data.message, "error");
		} finally {
			setIsLoading(false);
		}
	}

	const handleDelete = async (postId) => {
		try {
			const res = await axiosInstance.delete(`/post/${postId}`, { withCredentials: true })
			fetchUser();
			if (res.status === 200) {
				showToast(true, res.data.message, "success");
			}
		} catch (error) {
			showToast(true, error.response.data.message, "error");
		}
	}

	const UserLogout = async () => {
		try {
			const res = await axiosInstance.post(`/logout`, { withCredentials: true })
			if (res.status === 200) {
				showToast(true, res.data.message, "success");
				setTimeout(() => {
					localStorage.clear();
					setIsAuth(false);
					navigate("/auth");
				}, 2000);
			}
		} catch (error) {
			showToast(true, error.response.data.message, "error");
		}
	}

	useEffect(() => {
		fetchUser();
	}, [_id])

	return (
		<>
			{isLoading && <div className="flex items-center justify-center h-screen"><Loading text={"Loading..."} /></div>}
			{!isLoading &&
				(<div className="w-full relative flex justify-center items-center">
					<div className="m-auto p-2 inter-regular">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-8 md:p-4">
							<div>
								<img src={userData?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user_profilePicture" className="w-36 h-36 rounded-full" />
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-2 md:gap-8">
									<p className="font-bold text-2xl">{userData?.username}</p>
									{user?._id === userData?._id ?
										<Link to={`/edit/${_id}`}>
											<Button
												type="button"
												icon={<FaUserEdit size={"1.5rem"} />}
												text={"edit profile"}

												textStyle={"hidden md:inline"}
											/>
										</Link>
										:
										<>
											<Button
												type="button"
												text={"follow"}
											/>
										</>
									}
									{user?._id === userData?._id && isAuth &&
										<Button
											icon={<IoMdLogOut size={"1.5rem"} />}
											text={"logout"}
											textStyle={"hidden md:inline"}
											onClick={() => UserLogout()}
										/>
									}
								</div>
								<div className="flex items-center gap-8 text-lg">
									<p><strong>{userData?.postLength || 0}</strong> Posts</p>
									<p><strong>{userData?.followers?.length || 0}</strong> Followers</p>
									<p><strong>{userData?.following?.length || 0}</strong> Following</p>
								</div>
								<p className="text-lg font-medium">{userData?._id}</p>
								{userData?.bio ?
									<p className="raleway text-lg font-light whitespace-pre-line">{userData?.bio}</p>
									:
									<p>Bio: Not provided</p>
								}
							</div>
						</div>
						<div className="mt-4">
							{userData?.totalPost?.length > 0 ? <>
								<div className="grid grid-cols-3 gap-4">
									{
										userData?.totalPost.slice().reverse().map((post, index) => (
											<div
												key={index}
												onClick={() => {
													setSinglePostView(true);
													localStorage.setItem("singlePost", JSON.stringify(post))
												}}
												className="cursor-pointer"
											>
												<img src={post.image} alt="post_image" className="w-full" />
											</div>
										))
									}
								</div>
							</> : <><p className="text-center">No posts found</p></>
							}
						</div>
					</div>
				</div>
				)
			}
			{toast?.isOpen && <Toast toast={toast} />}

			{singlePostView &&
				(
					<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
						<SinglePost userData={userData} setSinglePostView={setSinglePostView} handleDelete={handleDelete} />
					</div>
				)
			}

		</>
	)
}

export default Profile;