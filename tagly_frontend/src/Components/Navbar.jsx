import { Link, useNavigate } from "react-router-dom"
import Logo from "./Logo"
import Button from "./Button";
import { useContext, useEffect } from "react";
import { ContextAPI } from "../context/ContextProvider";
import { IoMdLogIn } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, user } = useContext(ContextAPI);
	useEffect(() => {

	}, [user])
	return (
		<>
			<div className="px-4 md:px-8 py-3 flex items-center justify-between border-b mb-4"
				style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
			>
				<Link to={"/"}>
					<Logo />
				</Link>
				<div className="flex items-center md:gap-4">
					{isAuth && <Button
						icon={<FiPlusCircle size={"1.5rem"} />}
						text={"create post"}
						style={"border-0 md:border-2"}
						textStyle={"hidden md:inline"}
						onClick={() => navigate("/create")}
					/>}
					<Button
						text={"explore"}
						textStyle={"hidden md:inline"}
						icon={<MdOutlineExplore size={"1.5rem"} />}
						style={"border-0 md:border-2"}
						onClick={() => navigate("/explore")}
					/>
					{isAuth ?
						<Link to={`/profile/${user?._id}`}>
							<Button
								img={user?.profilePicture ? user?.profilePicture : "https://tinyurl.com/5paj2hrp"}
								text={user?.username}
								icon={<FaRegUser size={"1.5rem"} />}
								iconStyle={"block md:hidden"}
								imgStyle={"hidden md:block"}
								textStyle={"hidden md:inline"}
								style={"border-0 md:border-2"}
							/>
						</Link>
						:
						<Link to={"/auth"}>
							<Button
								icon={<IoMdLogIn size={"1.5rem"} />}
								text={"login"}
								iconStyle={"block md:hidden"}
								textStyle={"hidden md:inline"}
								style={"border-0 md:border-2"}
							/>
						</Link>
					}
				</div>
			</div>

		</>
	)
}

export default Navbar;