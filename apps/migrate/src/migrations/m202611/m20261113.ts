export const m20261113: string[] = [
	`alter table "point_of_interest" rename column "start_date" to "established_year";`,
	`alter table "point_of_interest" drop column "end_date";`,
	`alter table "point_of_interest_suggestion" rename column "start_date" to "established_year";`,
	`alter table "point_of_interest_suggestion" drop column "end_date";`,
];
