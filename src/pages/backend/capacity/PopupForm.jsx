import React from 'react';
import InputField from './../../../ui-share/InputField';
import CustomButton from './../../../ui-share/CustomButton';
import Popup from './../../../ui-share/Popup';
import ToggleSwitch from './../../../ui-share/ToggleSwitch';

const PopupForm = ({title, formData, handleInputChange, handleSave, handleClose, loading, isTable, errors}) => (
	<Popup
		isOpen
		title={title}
		content={
			<div className="flex flex-col gap-5 min-w-[350px]">
				<InputField
					type="text"
					name="name"
					placeholder={`${title.split(' ')[0]} name`}
					value={formData.name}
					onChange={handleInputChange}
					error={errors.name}
				/>
				{isTable && (
					<div className="flex gap-2">
						<InputField
							type="number"
							name="minCapacity"
							placeholder="Minimum capacity"
							value={formData.minCapacity}
							onChange={handleInputChange}
							error={errors.minCapacity}
						/>
						<InputField
							type="number"
							name="maxCapacity"
							placeholder="Maximum capacity"
							value={formData.maxCapacity}
							onChange={handleInputChange}
							error={errors.maxCapacity}
						/>
					</div>
				)}
				{/* <div className="flex items-center justify-between gap-5">
					<div>
						<h5 className="text-titleText font-bold">Reservable online</h5>
						<p className="text-sm text-bodyText">
							Make this {isTable ? 'table' : 'area'} available for online reservations.
						</p>
					</div>
					<ToggleSwitch />
				</div> */}
				<div className="w-full flex items-center gap-3 justify-end mt-10">
					<CustomButton
						text={loading ? 'Saving...' : 'Save'}
						className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md"
						onClick={handleSave}
						loading={loading}
					/>
					<CustomButton
						text="Cancel"
						className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
						onClick={handleClose}
					/>
				</div>
			</div>
		}
		onClose={handleClose}
	/>
);

export default PopupForm;
