import React, {useMemo, useEffect} from 'react';
import {DropdownField} from '@northernexplorer/tools-web';
import {useApiFetch} from '~/core/useApiFetch';
import {useAppDispatch, useAppSelector} from '~/core/storeHooks';
import {setCountries} from '~/location/state/reference/referenceSlice';

interface ComponentProps<T extends string> {
	fieldName: T;
	label?: string;
	value: string;
	updateField: (name: T, value: string) => void;
	error?: string;
	isSearchable?: boolean;
	disabled?: boolean;
}

export function CountryDropdown<T extends string>({
	fieldName,
	label = 'Country',
	value,
	updateField,
	error,
	isSearchable = true,
	disabled,
}: ComponentProps<T>) {
	const dispatch = useAppDispatch();
	const cachedCountries = useAppSelector(s => s.reference.countries);

	const shouldFetch = !cachedCountries || cachedCountries.length === 0;
	const {data, loading} = useApiFetch('location', 'CountryController', 'getAll', {}, {skip: !shouldFetch});

	useEffect(() => {
		if (data && Array.isArray(data) && data.length > 0) {
			dispatch(setCountries(data));
		}
	}, [data, dispatch]);

	const countries = cachedCountries && cachedCountries.length > 0 ? cachedCountries : data;

	const options = useMemo(() => {
		if (!Array.isArray(countries)) return [];
		return countries.map(country => ({
			label: country.name,
			value: country.id,
		}));
	}, [countries]);

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
			disabled={disabled}
		/>
	);
}
