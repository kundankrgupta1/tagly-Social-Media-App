const Toast = ({ toast }) => {
	return (
		<>
			{toast?.isOpen && (
				<div className='fixed top-4 right-4 z-50 rounded-sm shadow'>
					<div className={`${toast?.type === "success" ? "bg-green-300" : "bg-red-300"} rounded-sm flex items-center px-4 py-2 gap-2`}>
						<p className='text-black font-medium text-md'>{toast?.message}</p>
					</div>
				</div>
			)}
		</>
	)
}

export default Toast