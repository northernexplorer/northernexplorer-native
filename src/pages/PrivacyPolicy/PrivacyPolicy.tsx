import {AppMarkdown} from "~/layout";

export function PrivacyPolicy() {
    const PRIVACY_POLICY = `
Last updated: June 13, 2026

Northern Explorer ("we", "our", or "us") respects your privacy and is committed to protecting any information you may provide while using our application or website.

This Privacy Policy explains how we handle information when you use Northern Explorer.

## 1. Information We Collect

We may collect limited information necessary to provide and improve the service. This may include:

- Device information (such as device type, operating system, and browser type)
- Usage data (such as pages viewed, time spent, and interactions within the app)
- Location data (only if you explicitly enable location-based features such as weather or local exploration)

We do not collect personally identifiable information unless you voluntarily provide it.

## 2. How We Use Information

We use collected information to:

- Improve app performance and user experience
- Provide location-based features such as weather and forecasts
- Analyze usage trends to improve content and functionality

## 3. Data Sharing

We do not sell, trade, or rent your personal information to third parties.

We may use trusted third-party services (such as analytics or weather providers) that process limited data strictly for service functionality.

## 4. Location Data

If you enable location services, your location may be used to provide relevant features such as weather forecasts or nearby exploration content.

Location data is not stored or shared beyond what is required for real-time functionality.

## 5. Data Security

We take reasonable measures to protect data, but no method of transmission over the internet or electronic storage is 100% secure.

## 6. Third-Party Services

Northern Explorer may contain links or integrations with third-party services. We are not responsible for the privacy practices of these services.

## 7. Children's Privacy

Northern Explorer does not knowingly collect personal information from children under the age of 13.

## 8. Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted within the app or website with an updated date.

## 9. Contact

If you have any questions about this Privacy Policy, you can contact us through the support section of the app or website.
`;

    return <AppMarkdown content={PRIVACY_POLICY} />;
}