import { createContext, useEffect, useState } from "react"
export const ContextAPI = createContext();

const getStoredUser = () => {
	try {
		const storedUser = localStorage.getItem("user");
		return (!storedUser || storedUser === "undefined") ? null : JSON.parse(storedUser);
	} catch (error) {
		return null;
	}
}
const ContextProvider = ({ children }) => {
	const [user, setUser] = useState(getStoredUser());
	const [isAuth, setIsAuth] = useState(!getStoredUser() ? false : true);
	const [toggle, setToggle] = useState(false);
	
	useEffect(() => {
		if (!user) {
			setIsAuth(false);
			localStorage.clear();
		}
	}, [user])

	return (
		<ContextAPI.Provider value={{ toggle, setToggle, isAuth, setIsAuth, user, setUser }}>
			{children}
		</ContextAPI.Provider>
	)
}

export default ContextProvider

