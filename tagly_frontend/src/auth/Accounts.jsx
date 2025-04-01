import { useContext } from "react";
import Logo from "../Components/Logo";
import Login from "./Login";
import Register from "./Register";
import { ContextAPI } from "../context/ContextProvider";

const Accounts = () => {
	const { toggle, setToggle } = useContext(ContextAPI);
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="md:w-2/4 m-auto md:p-6 flex flex-col gap-4">
				<div className="flex items-center justify-center mb-4">
					<Logo />
				</div>
				{
					!toggle ? <><Login /></> : <><Register /></>
				}
				<div>
					{!toggle ?
						<p className="text-center">
							Don&lsquo;t have an account?&nbsp;
							<span className="text-blue-600 cursor-pointer font-bold" onClick={() => setToggle(true)}>Register</span>
						</p>
						:
						<p className="text-center">
							Already have an account?&nbsp;
							<span className="text-blue-600 cursor-pointer font-bold" onClick={() => setToggle(false)}>Login</span>
						</p>
					}
				</div>
			</div>
		</div>
	)
}

export default Accounts