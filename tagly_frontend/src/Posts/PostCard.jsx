import { useContext, useEffect, useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { ContextAPI } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import { calculateTimeAgo } from "../utils/Time";
import Loading from "../Components/Loading";

const PostCard = ({ _id, userId, caption, image, location, createdAt, handleDelete, isLoadingDel }) => {

	const { user } = useContext(ContextAPI)
	const postTime = calculateTimeAgo(createdAt)
	const [visibleButton, setVisibleButton] = useState(false)
	const [comments, setComments] = useState("")

	const foo = () => {
		if (comments !== "") {
			setVisibleButton(true)
		} else {
			setVisibleButton(false)
		}
	}

	const handleCommentSubmit = (e) => {
		e.preventDefault()
	}

	useEffect(() => {
		foo();
	}, [comments])


	return (
		<div className="cursor-pointer bg-inherit w-fit m-auto md:border-[1px] md:border-solid md:border-black p-4 rounded-md md:mt-4 flex flex-col gap-2">
			{userId?.profilePicture &&
				<div className="flex justify-between items-center gap-2"
				>
					<div className="flex items-center gap-2">
						<img
							src={userId?.profilePicture || "https://tinyurl.com/5paj2hrp"}
							alt=""
							className="rounded-full h-10 w-10"
						/>
						<div>
							<div className="flex items-center gap-2">
								<Link
									to={`/profile/${userId?._id}`}
									className="text-sm font-medium hover:text-blue-600"
								>
									{userId?.username}
								</Link>
								<span>•</span>
								<p className="text-xs font-medium text-gray-400">{postTime}</p>
								{user?._id !== userId?._id ?
									<>
										<span>•</span>
										<button className="text-xs font-medium text-blue-500">
											Follow
										</button>
									</>
									:
									<></>
								}
							</div>
							<p className="text-xs">{location}</p>
						</div>
					</div>
					{user?._id === userId?._id && <div className="flex gap-3">
						<button className="text-2xl"><MdEdit /></button>
						<button className="text-2xl" onClick={() => handleDelete(_id)}>{isLoadingDel ? <Loading /> : <MdDelete />}</button>
					</div>}
				</div>}
			<img src={image} alt="" className="rounded-md w-96 h-[500px]" />
			{userId && <div className="flex flex-col gap-1">
				<div className="flex justify-between items-center gap-5">
					<div className="flex gap-3">
						<button className="text-2xl"><FaRegHeart /></button>
						<button className="text-2xl"><FaRegComment /></button>
						<button className="text-2xl"><FiSend /></button>
					</div>
				</div>
				<p className="text-sm font-medium">1,12,486 likes</p>
				<p className="text-xs font-medium truncate max-w-xs overflow-hidden">{caption}</p>
			</div>}
			{userId && <form onSubmit={handleCommentSubmit} className="flex justify-between">
				<input
					type="text"
					placeholder="Add a comment..."
					className="w-full outline-none text-sm"
					onChange={(e) => setComments(e.target.value)}
				/>
				{visibleButton &&
					<button
						type="submit"
						className="font-semibold text-xs text-blue-600 hover:text-blue-800 px-1 rounded-sm"
					>
						Post
					</button>
				}
			</form>}
		</div>
	)
}

export default PostCard;
