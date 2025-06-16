const Options = (key) => {
	let maxAge;
	if (key === "logout") {
		maxAge = 0;
	} else if (key === "refreshToken") {
		maxAge = 7 * 24 * 60 * 60 * 1000;
	} else {
		maxAge = 15 * 60 * 1000;
	}
	return {
		httpOnly: true,
		sameSite: "none",
		secure: true,
		maxAge: maxAge
	}
}
export default Options;
