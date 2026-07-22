import React from 'react';
import {Markdown} from '~/layout/Layout';

const DELETE_ACCOUNT_MARKDOWN = `
*Last updated: July 22, 2026*

# Account Deletion Guide

Follow these steps within the Northern Explorer mobile application to permanently delete your account and associated data:

1. *Sign in* to your Northern Explorer account.
2. Tap the *Profile* icon in the navigation bar.
3. Select *Other* from your profile menu settings.
4. Tap *Delete Account*.
5. Confirm your selection when prompted.

> *Warning:* Account deletion is permanent and cannot be undone. All your saved profile details, session data, and activity history will be erased immediately.
`;

export function DeleteAccount() {
	return <Markdown content={DELETE_ACCOUNT_MARKDOWN} />;
}
