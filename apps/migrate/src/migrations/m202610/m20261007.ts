export const m20261007: string[] = [
	`create table "report" ("id" uuid not null, "version" int not null default 1, "type" text check ("type" in ('Review', 'Image')) not null, "reason" text check ("reason" in ('Spam', 'HateSpeech', 'Inappropriate', 'NotRelevant', 'Other')) not null, "description" text null, "status" text check ("status" in ('Pending', 'Resolved', 'Dismissed')) not null default 'Pending', "user_id" uuid not null, "review_id" uuid null, "image_id" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
	`create index "idx_report_status" on "report" ("status");`,
	`create index "idx_report_user_id" on "report" ("user_id");`,
	`create index "idx_report_review_id" on "report" ("review_id");`,
	`create index "idx_report_image_id" on "report" ("image_id");`,
	`alter table "report" add constraint "report_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
	`alter table "report" add constraint "report_review_id_foreign" foreign key ("review_id") references "review" ("id") on delete cascade;`,
	`alter table "report" add constraint "report_image_id_foreign" foreign key ("image_id") references "image" ("id") on delete cascade;`,
];
