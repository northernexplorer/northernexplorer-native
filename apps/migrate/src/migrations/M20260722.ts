export const m20260722 = [
   
   `
   CREATE TYPE "review_rating" as ENUM('TERRIBLE','POOR','AVERAGE','GOOD','EXCELLENT');
`,

`
   CREATE TABLE "review"
    (
    "id" uuid PRIMARY KEY,
    "version" integer not null default 1,
     "user_id" uuid NOT NULL,
    "created_at" timestamp without time zone NOT NULL,
     "updated_at" timestamp without time zone NOT NULL,
    "historic_site_id" uuid NOT NULL,
    "rating" "review_rating" NOT NULL,
       constraint "review_user_id_foreign" foreign key ("user_id") references "user"("id"),
       constraint "review_historic_site_id_foreign" foreign key ("historic_site_id") references "historic_site"("id")    

    );

    `,
    
]