import { IoChevronBackOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { calculateTimeAgo } from "../Components/Time";
import { ContextAPI } from "../context/ContextProvider";
import { useContext, useEffect, useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";

const SinglePost = ({ userData, setSinglePostView, handleDelete }) => {
	const { loggedInUser } = useContext(ContextAPI);
	const [visibleButton, setVisibleButton] = useState(false);
	const [comments, setComments] = useState("");
	const post = JSON.parse(localStorage.getItem("singlePost"));
	const postTime = calculateTimeAgo(post.createdAt);

	const foo = () => {
		setVisibleButton(comments.trim() !== "");
	};

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		console.log("comments", comments);
	};

	useEffect(() => {
		foo();
	}, [comments]);

	return (
		<div className="bg-white w-full h-full md:h-[50vh] xl:h-full md:flex md:w-5/6 xl:w-4/6">
			{/* Top Bar */}
			<div className="md:hidden border-b-2 h-16 flex items-center gap-4 px-2">
				<button
					onClick={() => {
						setSinglePostView(false);
						localStorage.removeItem("singlePost");
					}}
				>
					<IoChevronBackOutline size={30} />
				</button>
				<div className="flex items-center gap-2">
					<img
						src={userData?.profilePicture || "https://tinyurl.com/5paj2hrp"}
						alt=""
						className="rounded-full h-10 w-10"
					/>
					<div>
						<div className="flex items-center gap-2">
							<p
								className="text-md font-medium hover:text-blue-600"
							>
								{userData?.username}
							</p>
							<span>•</span>
							<p className="text-xs font-medium text-gray-400">{postTime}</p>
							{loggedInUser !== userData?._id && (
								<>
									<span>•</span>
									<button className="text-xs font-medium" onClick={() => console.log("Follow kar liya h")}>
										Follow
									</button>
								</>
							)}
						</div>
						<p className="text-xs">{post.location}</p>
					</div>
				</div>
			</div>

			{/* Main Layout */}
			<div className="flex flex-col md:flex-row md:h-full w-full">
				{/* Image Section */}
				<div className="w-full md:w-1/2 h-full">
					<img
						src={post.image}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Details Section */}
				<div className="w-full md:w-1/2 flex flex-col justify-between">
					{/* Header (md only) */}
					<div className="hidden md:flex items-center justify-between border-b-2 h-16 px-4 gap-2">
						<div className="flex items-center gap-2">
							<img
								src={userData?.profilePicture || "https://tinyurl.com/5paj2hrp"}
								alt=""
								className="rounded-full h-10 w-10"
							/>
							<div>
								<div className="flex items-center gap-2">
									<p
										className="text-md font-medium"
									>
										{userData?.username}
									</p>
									<span>•</span>
									<p className="text-xs font-medium text-gray-400">{postTime}</p>
									{loggedInUser !== userData?._id && (
										<>
											<span>•</span>
											<button className="text-xs font-medium text-white" onClick={() => console.log("Follow kar liya h")}>
												Follow
											</button>
										</>
									)}
								</div>
								<p className="text-xs">{post.location}</p>
							</div>
						</div>
						<button
							onClick={() => {
								setSinglePostView(false);
								localStorage.removeItem("singlePost");
							}}
						>
							<IoMdClose size={30} />
						</button>
					</div>

					{/* Scrollable Body (likes + caption + comments) */}
					<div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
						<div className="flex justify-between items-center gap-5 text-2xl">
							<div className="flex gap-3">
								<button><FaRegHeart /></button>
								<button><FaRegComment /></button>
								<button><FiSend /></button>
							</div>
							{loggedInUser === userData?._id && userData?._id === post?.userId && <div className="flex gap-3">
								<button className="text-2xl"><MdEdit /></button>
								<button className="text-2xl"
									onClick={() => { setSinglePostView(false); handleDelete(post?._id) }}
								>
									<MdDelete />
								</button>
							</div>}
						</div>
						<p className="text-sm font-medium">1,12,486 likes</p>
						<p className="text-sm">{post.caption}</p>

						{/* Future: Comments list here */}
						<div className="hidden md:block">
							<p className="text-xs text-gray-400">Comments will appear here...</p>
						</div>
					</div>

					{/* Comment Input */}
					<form onSubmit={handleCommentSubmit} className="border-t flex items-center px-4 py-2">
						<input
							type="text"
							placeholder="Add a comment..."
							className="w-full outline-none text-sm"
							onChange={(e) => setComments(e.target.value)}
							value={comments}
						/>
						{visibleButton && (
							<button
								type="submit"
								className="font-semibold text-xs text-blue-600 hover:text-blue-800 px-2"
							>
								Post
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default SinglePost;
