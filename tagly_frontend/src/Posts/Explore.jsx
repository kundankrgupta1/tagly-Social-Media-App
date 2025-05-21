import { useContext, useEffect, useState } from "react"
import SinglePost from "./PostCard"
import { ContextAPI } from "../context/ContextProvider"
import axios from "axios"
import { SERVER_URI } from "../App"
const Explore = () => {
	const { token, UserLogout } = useContext(ContextAPI)
	const [allPost, setAllPost] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const getPosts = async () => {
		setIsLoading(true)
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{[...allPost].sort(()=>0.5 - Math.random()).map((post) => {
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
		</div>
	)
}

export default Explore