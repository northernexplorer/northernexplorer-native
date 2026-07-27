export const m20260722 = [
	`
   CREATE TABLE "review"
    (
    "id" uuid PRIMARY KEY,
    "version" integer not null default 1,
     "user_id" uuid NOT NULL,
    "created_at" timestamp without time zone NOT NULL,
     "updated_at" timestamp without time zone NOT NULL,
    "historic_site_id" uuid NOT NULL,
    "rating" integer NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
       constraint "review_user_id_foreign" foreign key ("user_id") references "user"("id"),
       constraint "review_historic_site_id_foreign" foreign key ("historic_site_id") references "historic_site"("id")    

    );

    ALTER TABLE "user" add column "score" integer NOT NULL default 0
    `,
];
