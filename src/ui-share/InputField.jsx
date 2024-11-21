import React from 'react';

const InputField = ({type, name, placeholder, value, onChange, error, className}) => {
	return (
		<div className="flex flex-col w-full">
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className={`border rounded p-2 text-base ${
					error ? 'border-red-500' : 'border-gray-300'
				} focus:outline-none focus:shadow ${className}`}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};

export default InputField;
