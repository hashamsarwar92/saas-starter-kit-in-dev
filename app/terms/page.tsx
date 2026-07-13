"use client";

const COMPANY_NAME = "London Host";
const CONTACT_EMAIL = "support@yourdomain.com"; // ← replace
const EFFECTIVE_DATE = "01 January 2026"; // ← replace

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold">Terms & Conditions</h1>

        <p className="text-sm text-gray-500">
          Effective Date: {EFFECTIVE_DATE}
        </p>

        <p>
          These Terms & Conditions govern your use of services provided by{" "}
          <strong>{COMPANY_NAME}</strong> ("we", "us", or "our"). By using our services, you agree to these terms.
        </p>

        {/* 1 */}
        <Section title="1. Services">
          <p>
            {COMPANY_NAME} provides hosting and related digital services. Services are delivered using third-party infrastructure providers.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Account Responsibility">
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for your account and all activity under it</li>
            <li>You must provide accurate information</li>
            <li>You must keep your credentials secure</li>
          </ul>
        </Section>

        {/* 3 */}
        <Section title="3. Acceptable Use">
          <p className="font-medium">You agree NOT to use our services for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Illegal activities</li>
            <li>Abuse, attacks, or malicious behavior</li>
            <li>Adult or explicit content</li>
            <li>Cryptocurrency mining</li>
            <li>Any activity that disrupts infrastructure or services</li>
          </ul>
        </Section>

        {/* 4 */}
        <Section title="4. Payments & Billing">
          <ul className="list-disc pl-6 space-y-2">
            <li>All payments are processed via Stripe</li>
            <li>We do not store payment details</li>
            <li>All fees are non-refundable</li>
          </ul>
        </Section>

        {/* 5 */}
        <Section title="5. Service Availability">
          <p>
            Services are provided on an <strong>"as-is"</strong> and <strong>"as-available"</strong> basis.
          </p>
          <p className="mt-2">
            We make no guarantees regarding uptime, availability, or performance.
          </p>
        </Section>

        {/* 6 */}
        <Section title="6. Third-Party Services">
          <p>
            Our services rely on third-party providers including Vercel, GitHub, and Stripe.
          </p>
          <p className="mt-2">
            We are not responsible for failures, outages, or issues caused by these providers.
          </p>
        </Section>

        {/* 7 */}
        <Section title="7. Data & Content">
          <ul className="list-disc pl-6 space-y-2">
            <li>You retain full responsibility for your data</li>
            <li>We do not monitor hosted content unless required</li>
            <li>You must ensure your data complies with all laws</li>
          </ul>
        </Section>

        {/* 8 */}
        <Section title="8. Suspension & Termination">
          <ul className="list-disc pl-6 space-y-2">
            <li>We may suspend or terminate accounts at any time</li>
            <li>This includes violations of these terms</li>
            <li>We may delete data associated with terminated accounts</li>
          </ul>
        </Section>

        {/* 9 */}
        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, {COMPANY_NAME} shall not be liable for any damages, including:
          </p>

          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Data loss</li>
            <li>Service interruptions</li>
            <li>Business losses</li>
            <li>Indirect or consequential damages</li>
          </ul>

          <p className="mt-4 font-medium">
            Use of our services is entirely at your own risk.
          </p>
        </Section>

        {/* 10 */}
        <Section title="10. Indemnification">
          <p>
            You agree to indemnify and hold harmless {COMPANY_NAME} from any claims, damages, or legal actions resulting from your use of the services.
          </p>
        </Section>

        {/* 11 */}
        <Section title="11. Changes to Terms">
          <p>
            We may update these Terms at any time. Continued use of services constitutes acceptance of the updated Terms.
          </p>
        </Section>

        {/* 12 */}
        <Section title="12. Governing Law">
          <p>
            These Terms are governed by the laws of the United Kingdom.
          </p>
        </Section>

        {/* 13 */}
        <Section title="13. Contact">
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