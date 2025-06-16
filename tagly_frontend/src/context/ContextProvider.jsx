import { createContext, useState } from "react"
export const ContextAPI = createContext();

const ContextProvider = ({ children }) => {
	const [toggle, setToggle] = useState(false);
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
	const [isAuth, setIsAuth] = useState(!localStorage.getItem("user") ? false : true);
	const [allPostExplore, setAllPostExplore] = useState([]);

	return (
		<ContextAPI.Provider value={{ allPostExplore, setAllPostExplore, toggle, setToggle, isAuth, setIsAuth, user, setUser }}>
			{children}
		</ContextAPI.Provider>
	)
}

export default ContextProvider

