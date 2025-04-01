export const Input = ({ type, value, placeholder, onChange, required = false, style }) => (
	<input
		type={type}
		value={value}
		placeholder={placeholder}
		required={required}
		onChange={onChange}
		className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${style}`}
	/>
);
