export const m20260714f: string[] = [
	`INSERT INTO country (id,name)
    VALUES('ca','Canada');
`,
	`INSERT INTO region (id,name,country_id)
VALUES
   ('ab','Alberta', 'ca'),
('bc',  'British Columbia', 'ca'),
('mb',  'Manitoba', 'ca'),
('nb',  'New Brunswick', 'ca'),
('nl',  'Newfoundland and Labrador', 'ca'),
('ns',  'Nova Scotia', 'ca'),
('nt',  'Northwest Territories', 'ca'),
('nu',  'Nunavut', 'ca'),
('on',  'Ontario', 'ca'),
('pe',  'Prince Edward Island', 'ca'),
('qc',  'Quebec', 'ca'),
('sk',  'Saskatchewan', 'ca'),
('yt',  'Yukon', 'ca');
`,

	`
 ALTER TABLE historic_site RENAME COULMN "country" to "country_id";
 ALTER TABLE historic_site RENAME COULMN  "region" to "region_id";
`,
	`
UPDATE historic_site
SET country_id = 'ca',
    region_id = 'mb'
WHERE country_id = 'Canada'
AND region_id = 'Manitoba';
`,

	`
ALTER TABLE "historic_site"
ADD CONSTRAINT "fk_historic_site_country"
FOREIGN KEY ("country_id")
REFERENCES "country" ("id");

ALTER TABLE "historic_site"
ADD CONSTRAINT "fk_historic_site_region"
FOREIGN KEY ("region_id")
REFERENCES "region" ("id");

`,
];
