import { useEffect, useState } from "react"
import SinglePost from "./PostCard"
import axiosInstance from "../utils/axiosInstance"
import Toast from "../Components/Toast"
import useToast from "../Hooks/useToast"
const Explore = () => {
	const [allPost, setAllPost] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const { toast, showToast } = useToast();

	const getPosts = async () => {
		setIsLoading(true)
		try {
			const res = await axiosInstance.get(`/posts`, { withCredentials: true })
			setAllPost(res.data.allPost)
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
			showToast(true, error.response?.data?.message || "server error!!!", "error");
		}
	}
	useEffect(() => {
		getPosts();
	}, [])

	return (
		<>
			{isLoading && <div className="loader"></div>}
			{!isLoading && allPost.length === 0 && <div className="no-post">No posts found</div>}
			{!isLoading && allPost.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[...allPost].sort(() => 0.5 - Math.random()).map((post) => {
					return (
						<SinglePost
							key={post._id}
							caption={post.caption}
							image={post.image}
							location={post.location}
							createdAt={post.createdAt}
						/>
					)
				})}
				{toast?.isOpen && <Toast toast={toast} />}
			</div>}
		</>
	)
}

export default Explore