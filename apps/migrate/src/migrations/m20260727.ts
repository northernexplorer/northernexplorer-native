export const m20260727 = [
	`
      ALTER TABLE "review" add column "description" text 
    `,

	`alter table "subscription" drop column "end_date";`,
	`alter table "subscription" alter column "renewal_date" drop not null;`,
	`update "subscription" set "renewal_date" = null;`,
];
