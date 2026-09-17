export const m20260918: string[] = [
	'alter table "image" add column "can_be_cover" boolean null;',
	'update "image" set "can_be_cover" = false;',
	'update "image" set "processed" = false;',
	'alter table "image" alter column "can_be_cover" set not null;',
];
