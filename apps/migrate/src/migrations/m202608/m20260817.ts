export const m20260817: string[] = [
	`alter table "point_of_interest" drop constraint "historic_site_status_check";`,
	`alter table "point_of_interest" add constraint "point_of_interest_status_check" check ("status" in ('Published', 'Draft'));`,
	`alter table "user" add "birthday" date null, add "gender" text null;`,
	`update "user" set "birthday" = '2000-01-01', "gender" = 'Male' where "birthday" is null or "gender" is null;`,
	`alter table "user" add constraint "user_gender_check" check ("gender" in ('Male', 'Female', 'Other'));`,
];
