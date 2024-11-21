import React from 'react';

const CustomButton = ({icon: Icon, text, onClick, className, disabled}) => {
	return (
		<button
			onClick={onClick}
			className={`gap-2 rounded ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			disabled={disabled}
		>
			{Icon && <Icon />}
			<span>{text}</span>
		</button>
	);
};

export default CustomButton;
