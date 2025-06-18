import { useContext, useEffect, useState } from "react"
import PostCard from "./PostCard"
import Loading from "../Components/Loading"
import axiosInstance from "../utils/axiosInstance"
import useToast from "../Hooks/useToast"
import Toast from "../Components/Toast"
import { ContextAPI } from "../context/ContextProvider"

const AllPosts = () => {
	const {isAuth} = useContext(ContextAPI);
	const [allPost, setAllPost] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingDel, setIsLoadingDel] = useState(false);
	const { toast, showToast } = useToast();
	const getPosts = async () => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`/posts`, { withCredentials: true })
			if (res.status === 200) {
				setAllPost(res.data.allPost)
			}
		} catch (error) {
			showToast(true, error.response?.data?.message || "server error!!!", "error");
		} finally {
			setIsLoading(false);
		}
	}

	const handleDelete = async (postId) => {
		setIsLoadingDel(true);
		try {
			const res = await axiosInstance.delete(`/post/${postId}`, { withCredentials: true })
			if (res.status === 200) {
				showToast(true, res.data.message, "success");
				getPosts();
			}
		} catch (error) {
			showToast(true, error.response.data.message, "error");
		} finally {
			setIsLoadingDel(false);
		}
	}

	useEffect(() => {
		if (isAuth) {
			getPosts();
		}
	}, [isAuth])

	return (
		<>
			{isLoading && <div className="flex items-center justify-center h-screen"><Loading text="Loading posts..." /></div>}
			{!isLoading && toast.type !== "error" && allPost?.length === 0 && <div className="flex items-center justify-center h-screen">No posts found</div>}
			{!isLoading && toast.type !== "error" && (
				<>
					{allPost?.length > 0 && (
						allPost
							.slice()
							.reverse()
							.map((post) => (
								<PostCard key={post._id} {...post} handleDelete={() => handleDelete(post._id)} isLoadingDel={isLoadingDel} />
							))
					)}
				</>
			)}
			{toast.isOpen && <Toast toast={toast} />}
		</>
	)
}

export default AllPosts;
