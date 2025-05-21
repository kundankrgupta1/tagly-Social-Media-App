import { createContext, useState } from "react"
import { useNavigate } from "react-router-dom";
export const ContextAPI = createContext();

const ContextProvider = ({ children }) => {
	const navigate = useNavigate();
	const [toggle, setToggle] = useState(false);
	const [isAuth, setIsAuth] = useState(!localStorage.getItem("token") ? false : true);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loggedInUser, setLoggedInUser] = useState(!localStorage.getItem("token") ? null : localStorage.getItem("loggedInUser"));
	const [profilePicture, setProfilePicture] = useState(!localStorage.getItem("token") ? null : localStorage.getItem("profilePicture"));
	const [username, setUsername] = useState(!localStorage.getItem("token") ? null : localStorage.getItem("username"));
	const [logout, setLogout] = useState(false);
	const [message, setMessage] = useState("");
	const [allPostExplore, setAllPostExplore] = useState([]);

	const UserLogout = () => {
		localStorage.clear();
		setLogout(true);
		setMessage("✅ Logged out successfully");
		setTimeout(() => {
			setIsAuth(false);
			navigate("/api/v1/user/auth");
			setMessage("");
		}, 2000)
	}

	return (
		<ContextAPI.Provider value={{ allPostExplore, setAllPostExplore, toggle, setToggle, isAuth, setIsAuth, token, setToken, loggedInUser, setLoggedInUser, profilePicture, setProfilePicture, username, setUsername, logout, setLogout, UserLogout, message, setMessage }}>
			{children}
		</ContextAPI.Provider>
	)
}

export default ContextProvider

