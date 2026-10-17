export const m20261011: string[] = [
	`alter table "point_of_interest" add "rejection_reason" text null;`,
	`alter table "point_of_interest" add constraint "point_of_interest_rejection_reason_check" check ("rejection_reason" in ('TRESPASSING_REQUIRED', 'ECOLOGICALLY_SENSITIVE', 'CLOSED_PERMANENTLY', 'DUPLICATE', 'OUT_OF_SCOPE'));`,
	`alter table "point_of_interest" drop constraint "point_of_interest_status_check";`,
	`alter table "point_of_interest" add constraint "point_of_interest_status_check" check ("status" in ('Published', 'Draft', 'Rejected'));`,
];
