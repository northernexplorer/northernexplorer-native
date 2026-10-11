import {CityController} from './CityController';
import {CountryController} from './CountryController';
import {ImageController} from './ImageController';
import {OrganizationController} from './OrganizationController';
import {PointOfInterestController} from './PointOfInterestController';
import {PointOfInterestSuggestionController} from './PointOfInterestSuggestionController';
import {RegionController} from './RegionController';
import {ReviewController} from './ReviewController';

export const location = {
	CityController,
	CountryController,
	ImageController,
	OrganizationController,
	PointOfInterestController,
	PointOfInterestSuggestionController,
	RegionController,
	ReviewController,
};

export * from './CityController';
export * from './CountryController';
export * from './ImageController';
export * from './OrganizationController';
export * from './PointOfInterestController';
export * from './PointOfInterestSuggestionController';
export * from './RegionController';
export * from './ReviewController';
