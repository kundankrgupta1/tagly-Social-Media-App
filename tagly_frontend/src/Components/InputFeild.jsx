import { forwardRef } from "react";
export const Input = forwardRef(({ type, value, placeholder, onChange, required = false, style }, ref) => (
	<input
		ref={ref}
		type={type}
		value={value}
		placeholder={placeholder}
		required={required}
		onChange={onChange}
		className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${style}`}
	/>
));