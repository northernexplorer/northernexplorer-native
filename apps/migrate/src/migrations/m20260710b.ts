export const m20260710b: string[] = [
	`UPDATE "subscription"
    SET
    "end_date" = NULL,
    "renewal_date" = "start_date" + INTERVAL '1 month'`,
];
