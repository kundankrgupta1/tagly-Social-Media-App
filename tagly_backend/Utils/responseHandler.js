const handleSuccess = (res, data = {}, message, status) => {
	return res.status(status).json({
		success: true,
		message: message,
		data
	});
}

const handleError = (res, message, status) => {
	return res.status(status).json({
		success: false,
		message: message
	});
}

export default { handleSuccess, handleError };
