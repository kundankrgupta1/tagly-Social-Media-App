import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			const res = await axios.get(url);
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