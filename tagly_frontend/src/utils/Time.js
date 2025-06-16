export const calculateTimeAgo = (timestamp) => {
	const currentDate = new Date();
	const givenDate = new Date(timestamp);
	const differenceInMillis = currentDate - givenDate;

	const minute = 1000 * 60;
	const hour = minute * 60;
	const day = hour * 24;

	const differenceInDays = Math.floor(differenceInMillis / day);
	const differenceInHours = Math.floor((differenceInMillis % day) / hour);
	const differenceInMinutes = Math.floor((differenceInMillis % hour) / minute);

	if (differenceInDays > 0) {
		return differenceInDays === 1 ? "1d" : `${differenceInDays}d`;
	} else if (differenceInHours > 0) {
		return differenceInHours === 1 ? "1h" : `${differenceInHours}h`;
	} else if (differenceInMinutes > 0) {
		return differenceInMinutes === 1 ? "1m" : `${differenceInMinutes}m`;
	} else {
		return "Just now";
	}
};