import Logo from "./Logo";

const Loading = ({ text, pageLoading }) => {
	return (
		<>
			{pageLoading ?
				<div className="flex justify-center items-center h-screen">
					<div className="flex flex-col justify-center items-center gap-4">
						<Logo />
						<p className="text-xl text-blue-600 font-bold">Please wait...</p>
					</div>
				</div>
				:
				<div className="flex items-center gap-2 justify-center">
					<div className="w-5 h-5 border-2 border-gray-300 border-t-2 border-t-blue-500 rounded-full animate-spin"></div>
					{text}
				</div>
			}
		</>

	)
}

export default Loading;
