import React, {useMemo} from 'react';
import {DropdownField} from '@northernexplorer/tools';
import {useApiFetch} from '~/core/useApiFetch';

interface ComponentProps<T extends string> {
	fieldName: T;
	label?: string;
	value: string;
	updateField: (name: T, value: string) => void;
	error?: string;
}

export function CountryDropdown<T extends string>({fieldName, label = 'Country', value, updateField, error}: ComponentProps<T>) {
	const {data, loading} = useApiFetch('location', 'CountryController', 'getAll', {});

	const options = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.map(country => ({
			label: country.name,
			value: country.id,
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
