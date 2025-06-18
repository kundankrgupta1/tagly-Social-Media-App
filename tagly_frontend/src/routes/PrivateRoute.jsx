import { useContext } from "react"
import { ContextAPI } from "../context/ContextProvider"
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { isAuth, loading } = useContext(ContextAPI);
	if (loading) return null;
	return isAuth ? children : <Navigate to="/auth" />
}

export default PrivateRoute;