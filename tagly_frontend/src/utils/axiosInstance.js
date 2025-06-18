import axios from "axios";
const baseURL = "https://tagly-social-media-app.onrender.com";
// const baseURL = "http://localhost:3000";

const axiosInstance = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url === "/refresh-token") {
				window.location.href = "/auth";
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => axiosInstance(originalRequest))
					.catch(err => Promise.reject(err));
			}

			isRefreshing = true;

			try {
				const res = await axiosInstance.post("/refresh-token");
				if (res.status === 200) {
					isRefreshing = false;
					processQueue(null);
					return axiosInstance(originalRequest);
				}
			} catch (err) {
				isRefreshing = false;
				processQueue(err, null);
				if (err.response?.data?.logoutRequired) {
					window.location.href = "/auth";
				}
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
