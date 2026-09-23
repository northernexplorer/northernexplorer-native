export const m20260917: string[] = [
	`z
	`,
	`
		INSERT INTO public."user" (
			id,
			version,
			first_name,
			last_name,
			username,
			email,
			password_hash,
			created_at,
			is_active,
			subscription_id,
			roles,
			score,
			birthday,
			gender
		) VALUES (
					 '00000000-0000-0000-0000-000000000000',
					 1,
					 'System',
					 'User',
					 'system',
					 'system@northernexplorer.org',
					 '!',
					 NOW(),
					 true,
					 '00000000-0000-0000-0000-000000000000',
					 '{Admin}',
					 0,
					 '1970-01-01',
					 'Other'
				 );
	`,
];
