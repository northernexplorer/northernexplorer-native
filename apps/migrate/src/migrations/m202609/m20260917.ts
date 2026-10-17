export const m20260917: string[] = [
	`
		INSERT INTO public.subscription (
			id,
			version,
			start_date,
			renewal_date,
			subscription_level_id
		) VALUES (
					 '00000000-0000-0000-0000-000000000000',
					 1,
					 NOW(),
					 NULL,
					 '79722552-c811-4c77-b92c-d6cf529ead93'
				 ) ON CONFLICT (id) DO NOTHING;
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