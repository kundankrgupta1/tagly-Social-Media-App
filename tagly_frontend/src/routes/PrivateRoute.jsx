import { useContext } from "react"
import { ContextAPI } from "../context/ContextProvider"
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { isAuth } = useContext(ContextAPI);
	return isAuth ? children : <Navigate to="/api/v1/user/auth" />
}

export default PrivateRoute;