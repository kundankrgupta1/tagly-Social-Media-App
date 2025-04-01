import { useContext, useEffect, useState } from "react"
import axios from "axios";
import { ContextAPI } from "../context/ContextProvider"
import { SERVER_URI } from "../App";
import { Link, useParams } from "react-router-dom";
import Button from "../Components/Button";
import { FaUserEdit } from "react-icons/fa";
import Loading from "../Components/Loading";
import { IoMdLogOut } from "react-icons/io";
import SinglePost from "../Posts/SinglePost";

const Profile = () => {
	const { token, isAuth, loggedInUser, logout, message, UserLogout } = useContext(ContextAPI)
	const _id = useParams();
	const [userData, setUserData] = useState(null);
	const [postsData, setPostsData] = useState(null);
	console.log("userData", userData);
	console.log("postsData", postsData)
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [singlePostView, setSinglePostView] = useState(false);
	console.log("singlePost", singlePostView)
	const fetchUser = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${SERVER_URI}/user/${_id?._id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (res.data.success) {
				setUserData(res.data.data);
				setIsLoading(false);
			}
		} catch (error) {
			setError(error.response.data.message);
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchUser();
	}, [_id])

	return (
		<>
			{isLoading && <div className="flex items-center justify-center h-screen"><Loading text={"Loading..."} /></div>}
			{error && <h1>{error}</h1>}
			{!isLoading && !error &&
				(<div className="w-full relative flex justify-center items-center">
					<div className="m-auto p-2 inter-regular">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-8 md:p-4">
							<div>
								<img src={userData?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user_profilePicture" className="w-36 h-36 rounded-full" />
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-2 md:gap-8">
									<p className="font-bold text-2xl">{userData?.username}</p>
									{loggedInUser === userData?._id ?
										<Link to={`/api/v1/user/edit/${_id?._id}`}>
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
									{loggedInUser === userData?._id && isAuth &&
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
											<div key={index} onClick={() => { setSinglePostView(true); setPostsData(post) }} className="cursor-pointer">
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
			{logout &&
				(
					<div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
						<div
							className={`transform transition-transform duration-300 ease-in-out ${logout ? 'translate-y-0' : 'translate-y-full'
								} ${message && "bg-green-300"} p-6 shadow-lg rounded-t-lg w-full max-w-md sm:max-w-lg`}
						>
							{message && (
								<div className="w-fit mt-4 bg-green-300 rounded-sm text-black px-3 py-1">
									<p className="text-center">{message}</p>
								</div>
							)}
						</div>
					</div>
				)
			}

			{singlePostView &&
				(
					<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
						<SinglePost userId={postsData?._id} caption={postsData?.caption} image={postsData?.image} location={postsData?.location} createdAt={postsData?.createdAt} />
					</div>
				)
			}

		</>
	)
}

export default Profile