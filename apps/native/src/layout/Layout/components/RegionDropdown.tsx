import React, {useMemo, useEffect} from 'react';
import {DropdownField} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';
import {useAppDispatch, useAppSelector} from '~/core/storeHooks';
import {setRegionsForCountry} from '~/location/state/reference/referenceSlice';

interface RegionDropdownProps<T extends string> extends ComponentProps<T> {
	countryId?: string;
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

export function RegionDropdown<T extends string>({
	fieldName,
	countryId,
	label = 'Region',
	value,
	updateField,
	error,
	isSearchable = true,
	disabled,
}: RegionDropdownProps<T>) {
	const dispatch = useAppDispatch();
	const cachedRegions = useAppSelector(s => (countryId ? s.reference.regionsByCountryId[countryId] : undefined));

	const shouldFetch = Boolean(countryId) && (!cachedRegions || cachedRegions.length === 0);
	const {data, loading} = useApiFetch('location', 'RegionController', 'getByCountryId', {id: countryId!}, {skip: !shouldFetch});

	useEffect(() => {
		if (countryId && data && Array.isArray(data) && data.length > 0) {
			dispatch(setRegionsForCountry({countryId, regions: data}));
		}
	}, [countryId, data, dispatch]);

	const regions = cachedRegions && cachedRegions.length > 0 ? cachedRegions : data;

	const options = useMemo(() => {
		if (!Array.isArray(regions)) return [];
		return regions.map(region => ({
			label: region.name,
			value: region.id,
		}));
	}, [regions]);

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
			disabled={disabled || !Boolean(countryId)}
		/>
	);
}
