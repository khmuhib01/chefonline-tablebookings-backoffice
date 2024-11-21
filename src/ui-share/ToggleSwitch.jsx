import React from 'react';

const ToggleSwitch = ({checked, onChange}) => {
	return (
		<label className="flex items-center cursor-pointer">
			<div className="relative">
				<input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
				<div className={`block w-10 h-6 rounded-full ${checked ? 'bg-button' : 'bg-gray-300'}`}></div>
				<div
					className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
						checked ? 'transform translate-x-full' : ''
					}`}
				></div>
			</div>
		</label>
	);
};

export default ToggleSwitch;
