import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			const res = await axiosInstance.get(url);
			setData(res.data);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, [url])

	return { data, loading, error };
}

export { useFetch }