import React, {useEffect, useRef} from 'react';
import {MdOutlineCancel} from 'react-icons/md';

const Popup = ({isOpen, title, content, onClose}) => {
	const popupRef = useRef(null);

	useEffect(() => {
		const handleScrollLock = () => {
			document.body.style.overflow = isOpen ? 'hidden' : 'auto';
		};

		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		document.addEventListener('scroll', handleScrollLock, {passive: false});

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('scroll', handleScrollLock);
		};
	}, [isOpen, onClose]);

	return (
		<div
			className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[1000] ${
				isOpen ? 'flex' : 'hidden'
			}`}
		>
			<div
				ref={popupRef}
				className="bg-white flex flex-col gap-5 text-black mx-auto rounded-lg p-5 shadow-lg relative min-w-[350px]"
			>
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-bold">{title}</h3>
					{onClose && <MdOutlineCancel size={25} onClick={onClose} className="cursor-pointer" />}
				</div>
				<div className="py-5">{content}</div>
			</div>
		</div>
	);
};

export default Popup;
