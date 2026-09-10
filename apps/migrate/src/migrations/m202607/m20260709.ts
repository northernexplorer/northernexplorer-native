export const m20260709: string[] = [
	`create table "membership_level" ("id" serial primary key, "version" int not null default 1, "name" text not null, "enabled" boolean not null);`,
	`create table "membership" ("id" serial primary key, "version" int not null default 1, "membership_level_id" int not null, "start_date" timestamptz not null, "end_date" timestamptz, "renewal_date" timestamptz not null);`,

	`alter table "membership" add constraint "membership_membership_level_id_foreign" foreign key ("membership_level_id") references "membership_level" ("id");`,
	`insert into "membership_level" ("name", "enabled") values ('Pathfinder', true);`,
	`insert into "membership_level" ("name", "enabled") values ('Explorer', true);`,
	`insert into "membership_level" ("name", "enabled") values ('Trailblazer', true);`,
	`insert into "membership_level" ("name", "enabled") values ('Pioneer', true);`,
	`insert into "membership_level" ("name", "enabled") values ('Legend', true);`,

	`alter table "user" add "membership_id" int;`,

	`with inserted_memberships as (
     insert into "membership" ("membership_level_id", "start_date", "end_date", "renewal_date")
    select 1, now(), now() + interval '100 years', now() + interval '100 years'
    from "user"
    order by id -- Guarantee order matching
        returning id
        ),
        ranked_users as (
    select id, row_number() over (order by id) as r_num from "user"
        ),
        ranked_memberships as (
    select id, row_number() over (order by id) as m_num from inserted_memberships
        )
    update "user"
    set "membership_id" = rm.id
        from ranked_users ru
    join ranked_memberships rm on ru.r_num = rm.m_num
    where "user".id = ru.id;`,

	// 3. Enforce data integrity now that the data is mapped
	`alter table "user" alter column "membership_id" set not null;`,
	`alter table "user" add constraint "user_membership_id_unique" unique ("membership_id");`,
	`alter table "user" add constraint "user_membership_id_foreign" foreign key ("membership_id") references "membership" ("id") on delete cascade;`,
];
