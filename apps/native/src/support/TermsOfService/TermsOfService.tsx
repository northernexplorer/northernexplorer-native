import {Markdown} from '~/layout/Layout';

export function TermsOfService() {
	const TERMS_AND_CONDITIONS = `
*Last updated: July 5, 2026*

Welcome to Northern Explorer. By accessing or using our application, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.

## 1. Use of Service
Northern Explorer provides information, location-based services, and weather data for personal, non-commercial use. You agree to use the app only for lawful purposes and in accordance with these Terms.

## 2. User Accounts
If you create an account, you are responsible for maintaining the security of your account and for all activities that occur under the account. You must immediately notify us of any unauthorized use.

## 3. Intellectual Property
All content, features, and functionality of Northern Explorer (including text, graphics, logos, and software) are the exclusive property of Northern Explorer and its licensors and are protected by international copyright and intellectual property laws.

## 4. Limitation of Liability
Northern Explorer provides information on an "as-is" and "as-available" basis. 
- We do not guarantee the accuracy, completeness, or timeliness of location or weather data.
- In no event shall Northern Explorer be liable for any indirect, incidental, or consequential damages resulting from your use of the application.

## 5. Third-Party Links
Our service may contain links to third-party websites or services that are not owned or controlled by us. We assume no responsibility for the content, privacy policies, or practices of any third-party services.

## 6. Termination
We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason, including breach of these Terms.

## 7. Governing Law
These Terms shall be governed and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.

## 8. Changes to Terms
We reserve the right to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.

## 9. Contact Us
If you have any questions about these Terms, please contact us through the support section within the app.
`;

	return <Markdown content={TERMS_AND_CONDITIONS} />;
}
