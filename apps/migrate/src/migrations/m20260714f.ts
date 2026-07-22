export const m20260714f: string[] = [
	`INSERT INTO country (id, name) VALUES ('ca', 'Canada');`,

	`INSERT INTO region (id, name, country_id) VALUES
												   ('ab', 'Alberta', 'ca'),
												   ('bc', 'British Columbia', 'ca'),
												   ('mb', 'Manitoba', 'ca'),
												   ('nb', 'New Brunswick', 'ca'),
												   ('nl', 'Newfoundland and Labrador', 'ca'),
												   ('ns', 'Nova Scotia', 'ca'),
												   ('nt', 'Northwest Territories', 'ca'),
												   ('nu', 'Nunavut', 'ca'),
												   ('on', 'Ontario', 'ca'),
												   ('pe', 'Prince Edward Island', 'ca'),
												   ('qc', 'Quebec', 'ca'),
												   ('sk', 'Saskatchewan', 'ca'),
												   ('yt', 'Yukon', 'ca');
	`,

	`ALTER TABLE historic_site RENAME COLUMN "country" TO "country_id";
	ALTER TABLE historic_site RENAME COLUMN "region" TO "region_id";`,

	// Updated sanitization block to handle all regions
	`UPDATE historic_site SET country_id = 'ca' WHERE country_id = 'Canada';
	UPDATE historic_site SET region_id = 'ab' WHERE region_id = 'Alberta';
	UPDATE historic_site SET region_id = 'bc' WHERE region_id = 'British Columbia';
	UPDATE historic_site SET region_id = 'mb' WHERE region_id = 'Manitoba';
	UPDATE historic_site SET region_id = 'nb' WHERE region_id = 'New Brunswick';
	UPDATE historic_site SET region_id = 'nl' WHERE region_id = 'Newfoundland and Labrador';
	UPDATE historic_site SET region_id = 'ns' WHERE region_id = 'Nova Scotia';
	UPDATE historic_site SET region_id = 'nt' WHERE region_id = 'Northwest Territories';
	UPDATE historic_site SET region_id = 'nu' WHERE region_id = 'Nunavut';
	UPDATE historic_site SET region_id = 'on' WHERE region_id = 'Ontario';
	UPDATE historic_site SET region_id = 'pe' WHERE region_id = 'Prince Edward Island';
	UPDATE historic_site SET region_id = 'qc' WHERE region_id = 'Quebec';
	UPDATE historic_site SET region_id = 'sk' WHERE region_id = 'Saskatchewan';
	UPDATE historic_site SET region_id = 'yt' WHERE region_id = 'Yukon';`,

	// Constraints are applied last
	`ALTER TABLE "historic_site"
		ADD CONSTRAINT "fk_historic_site_country"
			FOREIGN KEY ("country_id")
				REFERENCES "country" ("id");

	ALTER TABLE "historic_site"
		ADD CONSTRAINT "fk_historic_site_region"
			FOREIGN KEY ("region_id")
				REFERENCES "region" ("id");
	`,
];
