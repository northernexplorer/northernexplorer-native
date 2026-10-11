import React, {useMemo, useEffect} from 'react';
import {DropdownField} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';
import {useAppDispatch, useAppSelector} from '~/core/storeHooks';
import {setOrganizationsForRegion} from '~/location/state/reference/referenceSlice';

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
	const dispatch = useAppDispatch();
	const cachedOrganizations = useAppSelector(s => (regionId ? s.reference.organizationsByRegionId[regionId] : s.reference.allOrganizations));

	const shouldFetch = Boolean(regionId) && (!cachedOrganizations || cachedOrganizations.length === 0);
	const {data, loading} = useApiFetch('location', 'OrganizationController', 'getAll', regionId ? {regionId} : {}, {
		skip: !shouldFetch,
	});

	useEffect(() => {
		if (regionId && data && Array.isArray(data) && data.length > 0) {
			dispatch(setOrganizationsForRegion({regionId, organizations: data}));
		}
	}, [regionId, data, dispatch]);

	const organizations = cachedOrganizations && cachedOrganizations.length > 0 ? cachedOrganizations : data;

	const options = useMemo(() => {
		if (!Array.isArray(organizations)) return [];
		return organizations.map(organization => ({
			label: organization.name,
			value: organization.id,
		}));
	}, [organizations]);

	return (
		<DropdownField
			fieldName={fieldName}
			label={label}
			value={value}
			options={options}
			updateField={updateField}
			loading={shouldFetch && loading}
			error={error}
			isSearchable={isSearchable}
			disabled={disabled || !Boolean(regionId)}
		/>
	);
}
