import { useContext, useEffect, useState } from "react"
import SinglePost from "./SinglePost"
import { ContextAPI } from "../context/ContextProvider"
import Loading from "../Components/Loading"
import axios from "axios"
import { SERVER_URI } from "../App"

const AllPosts = () => {
	const { token, UserLogout } = useContext(ContextAPI)
	const [allPost, setAllPost] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const getPosts = async () => {
		setIsLoading(true)
		if (!token) {
			setError("Please login first!!!")
			return;
		}
		try {
			const res = await axios.get(`${SERVER_URI}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			setAllPost(res.data.allPost)
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
			console.log("error from all post", error)
			if (error.response.status === 401 && error.response.data.message === "TokenExpiredError: jwt expired") {
				setError("Session expired, please login again!!!")
				setIsLoading(false)
			} else {
				setError(error.response?.data?.message || "server error!!!")
			}
			setTimeout(() => {
				if (error.response.status === 401 && error.response.data.message === "TokenExpiredError: jwt expired") {
					UserLogout();
				}
			}, 2000)
		}
	}
	useEffect(() => {
		getPosts();
	}, [])

	return (
		<>
			{isLoading && <div className="flex items-center justify-center h-screen"><Loading text="Loading posts..." /></div>}
			{error && <p>{error}</p>}
			{!isLoading && !error && (
				<>
					{allPost?.length > 0 ? (
						allPost
							.slice()
							.reverse()
							.map((post) => (
								<SinglePost key={post._id} {...post} />
							))
					) : (
						<p className="text-center">No posts found</p>
					)}
				</>
			)}
		</>
	)
}

export default AllPosts;
