import {useState} from 'react';

export const usePopup = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentId, setCurrentId] = useState(null);

	const open = (id = null) => {
		setIsOpen(true);
		setCurrentId(id);
	};

	const close = () => {
		setIsOpen(false);
		setCurrentId(null);
	};

	return {
		isOpen,
		currentId,
		open,
		close,
	};
};
