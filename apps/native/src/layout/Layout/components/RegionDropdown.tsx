import React, {useMemo} from 'react';
import {DropdownField} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';

interface RegionDropdownProps<T extends string> extends ComponentProps<T> {
	countryId: string;
}

interface ComponentProps<T extends string> {
	fieldName: T;
	label?: string;
	value: string;
	updateField: (name: T, value: string) => void;
	error?: string;
}

export function RegionDropdown<T extends string>({fieldName, countryId, label = 'Region', value, updateField, error}: RegionDropdownProps<T>) {
	const {data, loading} = useApiFetch('location', 'RegionController', 'getByCountryId', {id: countryId});

	const options = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.map(region => ({
			label: region.name,
			value: region.id,
		}));
	}, [data]);

	return (
		<DropdownField
			fieldName={fieldName}
			label={label}
			value={value}
			options={options}
			updateField={updateField}
			loading={loading}
			error={error}
		/>
	);
}
