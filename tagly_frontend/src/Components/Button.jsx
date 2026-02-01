const Button = ({ text, icon, img, style, type, onClick, textStyle, imgStyle, iconStyle }) => {
	return (
		<button className={`capitalize w-fit font-bold border-blue-600 text-blue-600 hover:text-white flex items-center gap-1 px-3 py-2 rounded-sm active:bg-blue-900 hover:bg-blue-700 ${style}`}
			type={type}
			onClick={onClick}
		>
			{img && <img src={img} alt="" className={`${imgStyle} h-6 w-6 rounded-full`} />}
			<span className={`${iconStyle}`}>{icon && icon}</span>
			<p className={`${textStyle}`}>{text && text}</p>
		</button>
	)
}

export default Button;