import { Metadata } from "next";
import LegalPageWrapper from "@/components/legal/LegalPageWrapper";
import { generateLegalMetadata } from "@/lib/metadata";
import TableOfContents from "@/components/legal/TableOfContents";

const lastUpdated = "2025-06-30";

export const metadata: Metadata = generateLegalMetadata(
  "Terms of Service",
  "Terms of Service for ShipKit.ai - AI chat platform with subscription services and payment processing through Stripe.",
);

const tocSections = [
  { id: "acceptance", title: "Acceptance of Terms", level: 1 },
  { id: "description", title: "Service Description", level: 1 },
  { id: "account", title: "Account Registration", level: 1 },
  { id: "subscription", title: "Subscription and Billing", level: 1 },
  { id: "payment", title: "Payment Processing", level: 1 },
  { id: "usage", title: "Acceptable Use", level: 1 },
  { id: "content", title: "User Content", level: 1 },
  { id: "intellectual", title: "Intellectual Property", level: 1 },
  { id: "privacy", title: "Privacy and Data", level: 1 },
  { id: "termination", title: "Termination", level: 1 },
  { id: "disclaimers", title: "Disclaimers", level: 1 },
  { id: "limitation", title: "Limitation of Liability", level: 1 },
  { id: "indemnification", title: "Indemnification", level: 1 },
  { id: "governing", title: "Governing Law", level: 1 },
  { id: "contact", title: "Contact Information", level: 1 },
];

export default function TermsOfService() {
  return (
    <div className="lg:flex lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="lg:flex-1">
        <LegalPageWrapper
          title="Terms of Service"
          lastUpdated={lastUpdated}
          description="These Terms of Service govern your use of ShipKit.ai, an AI chat platform offering subscription-based access to multiple AI models."
        >
          {/* Acceptance of Terms */}
          <section id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ShipKit.ai (&ldquo;Service&rdquo;), you
              agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
              If you disagree with any part of these terms, then you may not
              access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or
              use the Service, including but not limited to users who are
              subscribers to our paid services.
            </p>
            <p>
              We reserve the right to update and change these Terms from time to
              time without notice. Any new features that augment or enhance the
              current Service will be subject to the Terms. Continued use of the
              Service after any such changes constitutes your consent to such
              changes.
            </p>
          </section>

          {/* Service Description */}
          <section id="description">
            <h2>2. Service Description</h2>
            <p>
              ShipKit.ai is a unified chat interface that provides access to
              multiple AI models including but not limited to:
            </p>
            <ul>
              <li>OpenAI GPT models (GPT-4, GPT-3.5-turbo, and others)</li>
              <li>Anthropic Claude models</li>
              <li>Google Gemini models</li>
              <li>Meta LLaMA models</li>
              <li>Other AI models as they become available</li>
            </ul>
            <p>
              The Service allows users to interact with these AI models through
              a single, consistent interface, with features including
              conversation history, model switching, and subscription-based
              access controls.
            </p>
            <p>
              We offer both free and paid subscription tiers with different
              usage limits and feature access. The availability of specific
              models and features may vary by subscription tier.
            </p>
          </section>

          {/* Account Registration */}
          <section id="account">
            <h2>3. Account Registration and Security</h2>
            <p>
              To access certain features of the Service, you must register for
              an account. You agree to:
            </p>
            <ul>
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain the security of your password and account</li>
              <li>
                Notify us immediately of any breach of security or unauthorized
                use
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>
                Be at least 13 years of age (or the minimum age in your
                jurisdiction)
              </li>
            </ul>
            <p>
              We reserve the right to refuse service, terminate accounts, or
              cancel subscriptions at our sole discretion, particularly for
              violations of these Terms.
            </p>
          </section>

          {/* Subscription and Billing */}
          <section id="subscription">
            <h2>4. Subscription and Billing</h2>

            <h3>4.1 Subscription Tiers</h3>
            <p>We offer the following subscription tiers:</p>
            <ul>
              <li>
                <strong>Free Tier:</strong> Limited access to select AI models
                with usage restrictions
              </li>
              <li>
                <strong>Basic Tier:</strong> Expanded access with higher usage
                limits
              </li>
              <li>
                <strong>Pro Tier:</strong> Full access to all available models
                with premium features
              </li>
            </ul>

            <h3>4.2 Billing and Payment Terms</h3>
            <p>
              Paid subscriptions are billed on a recurring basis (monthly or
              annually, as selected). By subscribing, you authorize us to charge
              your payment method for the subscription fee, applicable taxes,
              and any additional usage fees.
            </p>

            <h3>4.3 Automatic Renewal</h3>
            <p>
              Your subscription will automatically renew for successive periods
              unless you cancel before the end of the current billing period.
            </p>

            <h3>4.4 Cancellation and Refunds</h3>
            <p>
              You may cancel your subscription at any time through your account
              settings. Subscription fees are generally non-refundable except in
              cases of service outages or billing errors.
            </p>
          </section>

          {/* Payment Processing */}
          <section id="payment">
            <h2>5. Payment Processing</h2>
            <p>
              All payments are processed securely through Stripe, Inc.
              (&quot;Stripe&quot;). By providing payment information, you:
            </p>
            <ul>
              <li>
                Represent that you are authorized to use the payment method
              </li>
              <li>Authorize us to charge all fees incurred by your account</li>
              <li>
                Agree to Stripe&rsquo;s terms of service and privacy policy
              </li>
              <li>
                Acknowledge that we do not store your full payment information
              </li>
            </ul>
            <p>
              If your payment fails, we may suspend your access to paid features
              until payment is resolved. You remain responsible for any
              uncollected amounts.
            </p>
            <p>
              We reserve the right to change our pricing with 30 days&rsquo;
              notice. Price changes will not affect existing subscriptions until
              their next renewal date.
            </p>
          </section>

          {/* Acceptable Use */}
          <section id="usage">
            <h2>6. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>
                Generate illegal, harmful, threatening, abusive, or defamatory
                content
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation
              </li>
              <li>
                Violate any applicable local, state, national, or international
                law
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or other
                users&rsquo; accounts
              </li>
              <li>Distribute spam, malware, or other malicious content</li>
              <li>
                Use the Service for any commercial purpose without our written
                consent
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                Service
              </li>
              <li>
                Generate content that infringes on intellectual property rights
              </li>
              <li>
                Use the Service to compete with us or develop competing services
              </li>
            </ul>
            <p>
              We reserve the right to monitor usage and suspend or terminate
              accounts that violate these guidelines.
            </p>
          </section>

          {/* User Content */}
          <section id="content">
            <h2>7. User Content and Data</h2>
            <p>
              You retain ownership of any content you input into the Service
              (&quot;User Content&quot;). By using the Service, you grant us:
            </p>
            <ul>
              <li>A license to process your content to provide the Service</li>
              <li>The right to store conversation history for your account</li>
              <li>
                Permission to use aggregated, anonymized data for service
                improvement
              </li>
            </ul>
            <p>
              You are responsible for your User Content and must ensure you have
              all necessary rights to submit it. We are not responsible for the
              accuracy, quality, or legality of User Content.
            </p>
            <p>
              AI-generated responses are not considered User Content and may be
              used by us for service improvement, subject to our Privacy Policy.
            </p>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual">
            <h2>8. Intellectual Property Rights</h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by ADK Agent Simple and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of
              our Service or included software, nor may you reverse engineer or
              attempt to extract the source code of that software.
            </p>
            <p>
              All trademarks, service marks, and logos used in connection with
              the Service are the property of their respective owners.
            </p>
          </section>

          {/* Privacy and Data */}
          <section id="privacy">
            <h2>9. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your information when you use our
              Service.
            </p>
            <p>
              By using the Service, you consent to our collection and use of
              personal information as outlined in our Privacy Policy, which is
              incorporated into these Terms by reference.
            </p>
            <p>
              We implement appropriate security measures to protect your
              personal information, but cannot guarantee absolute security of
              data transmitted over the internet.
            </p>
          </section>

          {/* Termination */}
          <section id="termination">
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason,
              including breach of these Terms.
            </p>
            <p>Upon termination:</p>
            <ul>
              <li>Your right to use the Service will cease immediately</li>
              <li>We may delete your account and data after 30 days</li>
              <li>
                You remain liable for all charges incurred prior to termination
              </li>
              <li>
                Provisions that should survive termination will remain in effect
              </li>
            </ul>
            <p>
              You may terminate your account at any time by contacting us or
              using account deletion features in the Service.
            </p>
          </section>

          {/* Compliance Notice */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                🛡️ This service complies with <strong>GDPR</strong> and{" "}
                <strong>CCPA</strong> privacy regulations. See our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>{" "}
                for details.
              </span>
            </div>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers">
            <h2>11. Disclaimers</h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS
              AVAILABLE&quot; basis. We expressly disclaim all warranties of any
              kind, whether express or implied, including but not limited to:
            </p>
            <ul>
              <li>
                Implied warranties of merchantability and fitness for a
                particular purpose
              </li>
              <li>Non-infringement of third-party rights</li>
              <li>Accuracy, reliability, or availability of the Service</li>
              <li>Security of data or communications</li>
            </ul>
            <p>
              AI-generated content may contain errors, biases, or inaccuracies.
              You should verify important information independently and not rely
              solely on AI responses for critical decisions.
            </p>
            <p>
              We do not warrant that the Service will meet your requirements or
              be available on an uninterrupted, secure, or error-free basis.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation">
            <h2>12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event
              shall ShipKit.ai be liable for any indirect, punitive, incidental,
              special, consequential, or exemplary damages, including without
              limitation damages for loss of profits, goodwill, use, data, or
              other intangible losses.
            </p>
            <p>
              Our total liability to you for all damages, losses, and causes of
              action (whether in contract, tort, or otherwise) will not exceed
              the amount paid by you, if any, for accessing the Service during
              the twelve (12) months immediately preceding the date of the
              claim.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion of certain
              warranties or limitation of liability for consequential or
              incidental damages, so these limitations may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section id="indemnification">
            <h2>13. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless ShipKit.ai and
              its officers, directors, employees, and agents from and against
              any and all claims, damages, obligations, losses, liabilities,
              costs, and expenses (including attorney&rsquo;s fees) arising
              from:
            </p>
            <ul>
              <li>Your use of and access to the Service</li>
              <li>Your violation of any term of these Terms</li>
              <li>
                Your violation of any third-party right, including intellectual
                property rights
              </li>
              <li>
                Any claim that your User Content caused damage to a third party
              </li>
            </ul>
          </section>

          {/* Governing Law */}
          <section id="governing">
            <h2>14. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of [Your
              Jurisdiction], without regard to its conflict of law provisions.
              Any disputes arising from these Terms or your use of the Service
              will be resolved through binding arbitration in accordance with
              the rules of the American Arbitration Association.
            </p>
            <p>
              You and ShipKit.ai agree that any dispute resolution proceedings
              will be conducted only on an individual basis and not in a class,
              consolidated, or representative action.
            </p>
            <p>
              If for any reason a court of competent jurisdiction finds that
              this arbitration provision is unenforceable, then the dispute will
              be resolved in the state or federal courts located in [Your
              Jurisdiction].
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact">
            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p>
                <strong>Email:</strong> legal@shipkit.ai
              </p>
              <p>
                <strong>Address:</strong> [Your Company Address]
              </p>
              <p>
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Last Updated:</strong> {lastUpdated}
            </p>
          </section>

          <div className="section-divider"></div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              These Terms of Service are effective as of {lastUpdated} and will
              remain in effect except with respect to any changes in their
              provisions in the future, which will be in effect immediately
              after being posted on this page.
            </p>
          </div>
        </LegalPageWrapper>
      </div>

      {/* Table of Contents - Desktop Only */}
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <TableOfContents sections={tocSections} />
      </div>
    </div>
  );
}
