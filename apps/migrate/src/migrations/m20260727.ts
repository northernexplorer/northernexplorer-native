export const m20260727: string[] = [
	`alter table "subscription" drop column "end_date";`,
	`alter table "subscription" alter column "renewal_date" drop not null;`,
];
