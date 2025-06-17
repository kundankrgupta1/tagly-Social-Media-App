import { useLocation } from "react-router-dom"
import Navbar from "./Components/Navbar"
import AllRoutes from "./routes/AllRoutes"
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidError } from "react-icons/bi";
import Loading from "./Components/Loading";
import axiosInstance from "./utils/axiosInstance";
const App = () => {
	const location = useLocation();
	const hidePaths = ["/api/v1/user/auth"]
	const hideComponents = hidePaths.includes(location.pathname);

	const [serverRunning, setServerRunning] = useState(false);
	const [serverMessage, setServerMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const checkServer = async () => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`/health-check`);			
			if (res.status === 200) {
				setIsLoading(false);
				setServerRunning(true);
				setServerMessage(res.data.message);
			}
		} catch (error) {
			setServerRunning(false);
			setIsLoading(false);
			setServerMessage(error.message);
		}
	}

	useEffect(() => {
		checkServer()
	}, []);

	return (
		<>
			{serverRunning ?
				<div className="w-full h-screen montserrat">
					{isLoading && <Loading pageLoading={true} />}
					{!isLoading && !hideComponents && <Navbar />}
					{!isLoading && <AllRoutes />}
				</div>
				:
				<div>
					{isLoading && <Loading pageLoading={true} />}
					{!isLoading &&
						<div className="flex items-center justify-center h-screen gap-4 montserrat">
							<BiSolidError size={"4rem"} className="text-red-600" />
							<p className="text-5xl text-red-600">{serverMessage}</p>
						</div>
					}
				</div>
			}
		</>
	)
}

export default App;