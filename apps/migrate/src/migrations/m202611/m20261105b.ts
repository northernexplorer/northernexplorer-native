export const m20261105b: string[] = [
	`alter table "report" drop constraint "report_reason_check";`,
	`alter table "report" add constraint "report_reason_check" check ("reason" in ('Spam', 'HateSpeech', 'Inappropriate', 'NotRelevant', 'AIGeneratedImage', 'LowQuality', 'Other'));`,
];
