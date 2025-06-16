import { useState } from "react";

const useToast = () => {
	const [toast, setToast] = useState({
		isOpen: false,
		message: "",
		type: "",
	});

	const showToast = (isOpen, message, type) => {
		setToast({ isOpen, message, type });

		setTimeout(() => {
			setToast({ isOpen: false, message: "", type: "" });
		}, 2000);
	};

	return { toast, showToast };
}

export default useToast;