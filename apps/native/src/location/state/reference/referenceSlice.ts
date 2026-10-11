import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CountryType, RegionType, OrganizationType} from '@northernexplorer/types';

export interface ReferenceState {
	countries: CountryType[] | null;
	regionsByCountryId: Record<string, RegionType[]>;
	organizationsByRegionId: Record<string, OrganizationType[]>;
	allOrganizations: OrganizationType[] | null;
}

const initialState: ReferenceState = {
	countries: null,
	regionsByCountryId: {},
	organizationsByRegionId: {},
	allOrganizations: null,
};

const referenceSlice = createSlice({
	name: 'reference',
	initialState,
	reducers: {
		setCountries(state, action: PayloadAction<CountryType[]>) {
			state.countries = action.payload;
		},
		setRegionsForCountry(state, action: PayloadAction<{countryId: string; regions: RegionType[]}>) {
			state.regionsByCountryId[action.payload.countryId] = action.payload.regions;
		},
		setOrganizationsForRegion(state, action: PayloadAction<{regionId?: string; organizations: OrganizationType[]}>) {
			if (action.payload.regionId) {
				state.organizationsByRegionId[action.payload.regionId] = action.payload.organizations;
			} else {
				state.allOrganizations = action.payload.organizations;
			}
		},
		clearReferenceData(state) {
			state.countries = null;
			state.regionsByCountryId = {};
			state.organizationsByRegionId = {};
			state.allOrganizations = null;
		},
	},
});

export const {setCountries, setRegionsForCountry, setOrganizationsForRegion, clearReferenceData} = referenceSlice.actions;

export default referenceSlice.reducer;
