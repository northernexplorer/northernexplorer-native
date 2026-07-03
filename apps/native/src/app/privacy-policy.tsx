import { Layout } from '~/layout/Layout';
import { PrivacyPolicy } from '~/system/PrivacyPolicy';

export default function Page() {
  return <Layout Content={PrivacyPolicy} title="Privacy Policy" />;
}
