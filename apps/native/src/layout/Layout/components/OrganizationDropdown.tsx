import React, {useMemo} from 'react';
import {DropdownField} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';

interface OrganizationDropdownProps<T extends string> extends ComponentProps<T> {
	regionId?: string;
}

interface ComponentProps<T extends string> {
	fieldName: T;
	label?: string;
	value: string;
	updateField: (name: T, value: string) => void;
	error?: string;
	isSearchable?: boolean;
	disabled?: boolean;
}

export function OrganizationDropdown<T extends string>({
	fieldName,
	regionId,
	label = 'Organization',
	value,
	updateField,
	error,
	isSearchable = true,
	disabled,
}: OrganizationDropdownProps<T>) {
	const {data, loading} = useApiFetch('location', 'OrganizationController', 'getAll', regionId ? {regionId} : {}, {
		skip: !Boolean(regionId),
	});

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
			isSearchable={isSearchable}
			disabled={disabled || !Boolean(regionId)}
		/>
	);
}
