export const m20261105c: string[] = [
	`alter table "report" drop constraint "report_review_id_foreign";`,
	`alter table "report" add constraint "report_review_id_foreign" foreign key ("review_id") references "review" ("id") on delete set null;`,
	`alter table "report" drop constraint "report_image_id_foreign";`,
	`alter table "report" add constraint "report_image_id_foreign" foreign key ("image_id") references "image" ("id") on delete set null;`,
];
