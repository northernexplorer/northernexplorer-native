import React from 'react';
import {DropdownField} from '@northernexplorer/tools';
import {PointOfInterestTypeEnum} from '@northernexplorer/types';

interface ComponentProps<T extends string> {
	fieldName: T;
	label?: string;
	value: PointOfInterestTypeEnum[];
	updateField: (name: T, value: PointOfInterestTypeEnum[]) => void;
	error?: string;
	darkMode?: boolean;
}

export function PointOfInterestTypeDropdown<T extends string>({fieldName, label = 'Type', value, updateField, error, darkMode}: ComponentProps<T>) {
	const options = Object.values(PointOfInterestTypeEnum).map(option => ({
		label: option.replace(/([a-z])([A-Z])/g, '$1 $2'),
		value: option as string,
	}));

	const stringValues = value.map(v => v as string);

	const handleUpdate = (name: T, selectedValues: string[]) => {
		updateField(name, selectedValues as PointOfInterestTypeEnum[]);
	};

	return (
		<DropdownField<T, string>
			fieldName={fieldName}
			label={label}
			value={stringValues}
			options={options}
			updateField={handleUpdate}
			error={error}
			isMultiSelect
			darkMode={darkMode}
		/>
	);
}
