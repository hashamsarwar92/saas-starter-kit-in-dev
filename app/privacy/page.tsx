"use client";

const COMPANY_NAME = "London Host";
const CONTACT_EMAIL = "support@yourdomain.com"; // change this
const EFFECTIVE_DATE = "01 January 2026"; // change this

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold">Privacy Policy</h1>

        <p className="text-sm text-gray-500">
          Effective Date: {EFFECTIVE_DATE}
        </p>

        <p>
          This Privacy Policy explains how <strong>{COMPANY_NAME}</strong> ("we", "us", or "our")
          collects, uses, and protects personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and applicable data protection laws.
        </p>

        {/* Section 1 */}
        <Section title="1. Who We Are">
          <p>
            {COMPANY_NAME} is an independent hosting and digital services provider based in the United Kingdom.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data Controller for customer account data</li>
            <li>Data Processor for hosted customer data</li>
          </ul>
        </Section>

        {/* Section 2 */}
        <Section title="2. Personal Data We Collect">
          <SubSection title="2.1 Data You Provide">
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
            </ul>

            <p className="mt-4 font-medium">We do not collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Phone numbers</li>
              <li>Billing addresses</li>
              <li>Payment card details</li>
            </ul>
          </SubSection>

          <SubSection title="2.2 Payment Data">
            <p>
              All payments are processed securely via Stripe. We do not store or process payment card information.
            </p>
          </SubSection>

          <SubSection title="2.3 Automatically Collected Data">
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Device/browser information</li>
              <li>Log data</li>
              <li>Authentication session data</li>
            </ul>
          </SubSection>

          <SubSection title="2.4 Cookies & Tracking">
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication</li>
              <li>Analytics</li>
              <li>Marketing tracking</li>
            </ul>
          </SubSection>
        </Section>

        {/* Section 3 */}
        <Section title="3. Hosting & Customer Data">
          <p>
            When you use our hosting services, we process data on your behalf.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Databases</li>
            <li>Files and uploads</li>
            <li>Personal data of your end users</li>
          </ul>

          <p className="mt-4 font-medium">Your Role:</p>
          <p>You are the Data Controller.</p>

          <p className="mt-4 font-medium">Our Role:</p>
          <p>{COMPANY_NAME} acts as a Data Processor.</p>

          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>We do not control hosted data</li>
            <li>We do not monitor data unless required</li>
            <li>We process data only on your instructions</li>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section title="4. Legal Basis for Processing">
          <ul className="list-disc pl-6 space-y-2">
            <li>Contractual necessity</li>
            <li>Legitimate interests</li>
            <li>Legal obligations</li>
            <li>Consent (where required)</li>
          </ul>
        </Section>

        {/* Section 5 */}
        <Section title="5. Third-Party Services">
          <ul className="list-disc pl-6 space-y-2">
            <li>Vercel — infrastructure</li>
            <li>GitHub — code hosting</li>
            <li>Stripe — payments</li>
            <li>Email provider (third-party)</li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section title="6. International Data Transfers">
          <p>
            Data may be transferred outside the UK. Safeguards such as Standard Contractual Clauses (SCCs) are used where required.
          </p>
        </Section>

        {/* Section 7 */}
        <Section title="7. Data Retention">
          <ul className="list-disc pl-6 space-y-2">
            <li>Account data — while active</li>
            <li>Logs — for security</li>
            <li>Hosted data — controlled by customer</li>
          </ul>
        </Section>

        {/* Section 8 */}
        <Section title="8. Data Security">
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure authentication</li>
            <li>HTTPS encryption</li>
            <li>Access controls</li>
            <li>Trusted infrastructure providers</li>
          </ul>
        </Section>

        {/* Section 9 */}
        <Section title="9. Your Rights">
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your data</li>
            <li>Correct data</li>
            <li>Delete data</li>
            <li>Restrict processing</li>
            <li>Object to processing</li>
            <li>Data portability</li>
          </ul>

          <p className="mt-4">
            Contact: <span className="font-medium">{CONTACT_EMAIL}</span>
          </p>
        </Section>

        {/* Section 10 */}
        <Section title="10. Children">
          <p>
            Users under 18 should use services only with supervision.
          </p>
        </Section>

        {/* Section 11 */}
        <Section title="11. Changes to This Policy">
          <p>
            We may update this policy. Changes will be posted on this page.
          </p>
        </Section>

        {/* Section 12 */}
        <Section title="12. Contact">
          <p>Email: {CONTACT_EMAIL}</p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: any) {
  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
}