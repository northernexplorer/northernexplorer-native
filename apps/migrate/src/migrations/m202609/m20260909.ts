export const m20260909: string[] = [`alter table "image" add "hash" varchar(255) not null;`, `create index "image_hash_index" on "image" ("hash");`];
