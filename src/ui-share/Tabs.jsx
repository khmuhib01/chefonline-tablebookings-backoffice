import React, {useState} from 'react';

const Tabs = ({tabs}) => {
	const [activeTab, setActiveTab] = useState(tabs[0].label);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
				{tabs.map((tab) => (
					<button
						key={tab.label}
						onClick={() => setActiveTab(tab.label)}
						className={`text-lg ${
							activeTab === tab.label ? 'font-semibold text-button border-b-2 border-button' : 'text-gray-500'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div>{tabs.find((tab) => tab.label === activeTab)?.content}</div>
		</div>
	);
};

export default Tabs;
