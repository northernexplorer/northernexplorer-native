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

export function OrganizationDropdown<T extends string>({fieldName, label = 'Organization', value, updateField, error}: ComponentProps<T>) {
	const {data, loading} = useApiFetch('location', 'OrganizationController', 'getAll', {});

	const options = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.map(organization => ({
			label: organization.name,
			value: organization.id,
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
