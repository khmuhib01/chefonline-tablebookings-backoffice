import React, {useState} from 'react';
import CustomButton from './CustomButton';

const Accordion = ({items}) => {
	const [activeIndex, setActiveIndex] = useState(null);

	const handleSetActiveIndex = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div className="flex flex-col gap-3">
			{items.map((item, index) => (
				<div key={index}>
					<button
						onClick={() => handleSetActiveIndex(index)}
						className={`text-lg flex justify-between items-center w-full ${
							activeIndex === index ? 'font-semibold text-button border-b-2 border-button' : 'text-gray-500'
						}`}
					>
						{item.name}
						<span>{activeIndex === index ? '-' : '+'}</span>
					</button>
					{activeIndex === index && (
						<>
							<div className="p-2">
								<CustomButton
									text="Add Floor"
									className="border border-button hover:bg-buttonHover text-button hover:text-white py-2 px-4 rounded-md"
								/>
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default Accordion;
