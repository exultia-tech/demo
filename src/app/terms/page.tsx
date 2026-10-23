import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Exultia Technologies",
  description:
    "Terms of Service for Exultia Technologies products and services, including the support model, service levels, acceptable use, licensing, warranties, and liability.",
};

const LAST_UPDATED = "October 23, 2026";

type Section = {
  id: string;
  title: string;
  body: (string | { list: string[] })[];
};

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: [
      "These Terms of Service (the \"Terms\") form a binding agreement between you (\"you\" or \"Customer\") and Exultia Technologies (\"Exultia,\" \"we,\" \"us,\" or \"our\"). They govern your access to and use of our websites, APIs, software, and services, including Vantage, Praxis, PureIDE, PureOS, and Axiom (collectively, the \"Services\").",
      "By creating an account, purchasing a subscription, downloading software, calling our APIs, or otherwise using the Services, you agree to these Terms. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization, and \"you\" includes that organization. If you do not agree, do not use the Services.",
    ],
  },
  {
    id: "services",
    title: "2. The Services",
    body: [
      "Exultia provides cybersecurity software and intelligence, including aggregated threat and vulnerability data, operating system patch advisories, remediation and hotpatch content, hardened development environments, container images, and security education materials.",
      "Much of our software is designed to be self-hosted and run in your own environment. We may add, change, or discontinue features at any time. We will make reasonable efforts to give notice of material changes that reduce the core functionality of a paid plan.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts and Security",
    body: [
      "You must provide accurate registration information and keep it current. You are responsible for all activity under your account, for safeguarding your credentials and API tokens, and for promptly notifying us of any unauthorized use. We are not liable for losses caused by unauthorized use of your account that occurs before you notify us.",
    ],
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions, Fees, and Billing",
    body: [
      { list: [
        "Paid plans are billed in advance on the cycle shown at purchase and renew automatically until cancelled.",
        "You may cancel at any time; cancellation takes effect at the end of the current billing period. Except where required by law or stated in writing, fees are non-refundable and no credit is given for partial periods.",
        "Fees are exclusive of taxes. You are responsible for all applicable sales, use, VAT, and similar taxes, other than taxes on our net income.",
        "We may change pricing on at least 30 days' notice before your next renewal. Continued use after the effective date constitutes acceptance.",
        "Enterprise customers may be invoiced on negotiated terms (for example, Net-30). Late amounts may accrue interest at the lesser of 1.5% per month or the maximum rate permitted by law, and we may suspend access for accounts that remain overdue.",
      ] },
    ],
  },
  {
    id: "license",
    title: "5. License and Restrictions",
    body: [
      "Subject to these Terms and payment of applicable fees, Exultia grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services and any software we provide for your internal business or personal security purposes, within the limits of your plan (including seat, host, and rate limits).",
      "Some components are provided under open-source licenses. Those licenses govern your use of those components and prevail over these Terms to the extent they conflict.",
      "You agree not to:",
      { list: [
        "resell, sublicense, or redistribute the Services, data feeds, or derived datasets except as your plan expressly allows;",
        "scrape, mirror, or bulk-extract data in a manner that circumvents rate limits, access controls, or plan restrictions;",
        "reverse engineer, decompile, or attempt to derive source code from non-open-source components, except where law permits despite this restriction;",
        "remove or alter proprietary notices, license keys, or provenance and signature metadata;",
        "use the Services to build a competing product or to benchmark for public release without our written consent.",
      ] },
    ],
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable Use",
    body: [
      "You may use the Services only for lawful purposes and in accordance with these Terms. You will not:",
      { list: [
        "use threat intelligence, remediation content, or any Service to attack, compromise, or gain unauthorized access to systems you do not own or have explicit written permission to test;",
        "interfere with or disrupt the integrity, security, or performance of the Services or their underlying infrastructure;",
        "upload malware or other malicious code to the Services, other than samples or indicators submitted through channels we designate for research;",
        "attempt to probe, scan, or test the vulnerability of the Services without our prior written authorization;",
        "violate any applicable law, regulation, or third-party right, including export control and sanctions laws.",
      ] },
      "We may investigate suspected violations and suspend or terminate access where we reasonably believe these Terms have been breached.",
    ],
  },
  {
    id: "support",
    title: "7. Support Model and Service Levels",
    body: [
      "Exultia is a lean, independent cybersecurity lab. We prioritize deterministic code, self-hosted deployment, and sub-second atomic rollbacks, and we are deliberately transparent about our support model:",
      { list: [
        "No human SLAs or 24/7 paging. Standard SaaS and Enterprise subscriptions do not include contractual human uptime commitments, response-time guarantees (for example, one-hour response), or 24/7 on-call phone paging. We will not promise human availability that we cannot sustain.",
        "Autonomous and self-verifying software. Our software (Vantage, Praxis, PureIDE, PureOS, and Axiom) is engineered to be self-hosted and self-verifying, with built-in test harnesses and rapid rollback to reduce the risk of production downtime.",
        "24/7 AI support and documentation. Routine technical assistance, installation commands, license sizing, and error explanations are provided around the clock by our autonomous AI Support Agent and our published documentation. Reproducible defects are tracked transparently through our public issue tracker.",
        "Custom agreements. Organizations that require legally binding uptime SLAs, on-site personnel, or custom software development must enter into a separately negotiated Master Services Agreement (MSA) with bespoke retainer pricing. Unless and until such an agreement is signed by both parties, no service level commitment applies.",
      ] },
      "Hosted components are provided on a commercially reasonable efforts basis. We may perform scheduled or emergency maintenance and are not responsible for downtime caused by factors outside our reasonable control, including upstream data-source outages, internet or cloud-provider failures, and force majeure events.",
    ],
  },
  {
    id: "data-accuracy",
    title: "8. Threat Data, Advisories, and Remediation Content",
    body: [
      "Threat intelligence, vulnerability records, severity scores, patch advisories, and remediation or hotpatch content are aggregated from third-party and public sources and from our own analysis. They are provided for informational purposes and may be incomplete, delayed, or inaccurate.",
      "You are solely responsible for evaluating and testing any advisory, script, patch, configuration, or firewall rule before deploying it, and for maintaining backups and rollback plans. Automated remediation can affect system availability and behavior. You apply it at your own risk and discretion.",
    ],
  },
  {
    id: "customer-content",
    title: "9. Your Content and Data",
    body: [
      "You retain all rights in the data, configurations, and materials you submit to the Services (\"Customer Content\"). You grant Exultia a limited license to host, process, and transmit Customer Content solely to provide and secure the Services, and to improve them in aggregated, de-identified form. You represent that you have the rights necessary to submit Customer Content and that doing so does not violate any law or third-party right.",
      "Where software is self-hosted, Customer Content remains in your environment and is not transmitted to Exultia except as required for license verification or features you explicitly enable.",
    ],
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    body: [
      "The Services, including their software, design, documentation, trademarks, and aggregated datasets, are owned by Exultia or its licensors and are protected by intellectual property laws. Except for the limited rights expressly granted in these Terms, no rights are transferred to you. If you provide feedback or suggestions, you grant us a perpetual, irrevocable, royalty-free license to use them without obligation to you.",
    ],
  },
  {
    id: "third-party",
    title: "11. Third-Party Services and Open Source",
    body: [
      "The Services integrate with or depend on third-party data sources, registries, cloud platforms, and open-source software. We do not control and are not responsible for third-party services, their availability, or their content. Your use of third-party services is governed by their own terms.",
    ],
  },
  {
    id: "confidentiality",
    title: "12. Confidentiality",
    body: [
      "Each party may receive non-public information from the other that is marked confidential or that a reasonable person would understand to be confidential. The receiving party will use it only to perform under these Terms, protect it with reasonable care, and not disclose it except to personnel and advisors with a need to know who are bound by similar obligations, or as required by law. These obligations do not apply to information that is public through no fault of the recipient, already known to it, independently developed, or rightfully received from a third party.",
    ],
  },
  {
    id: "warranty",
    title: "13. Disclaimer of Warranties",
    body: [
      "THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE.\" TO THE FULLEST EXTENT PERMITTED BY LAW, EXULTIA DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES OR ANY DATA OR CONTENT WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, COMPLETE, OR ACCURATE, OR THAT THEY WILL DETECT, PREVENT, OR REMEDIATE ALL THREATS OR VULNERABILITIES. NO SECURITY PRODUCT CAN GUARANTEE PROTECTION AGAINST ALL ATTACKS.",
    ],
  },
  {
    id: "liability",
    title: "14. Limitation of Liability",
    body: [
      "TO THE FULLEST EXTENT PERMITTED BY LAW, EXULTIA AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
      "OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO EXULTIA FOR THE SERVICES GIVING RISE TO THE CLAIM IN THE TWELVE (12) MONTHS PRECEDING THE EVENT, OR (B) ONE HUNDRED U.S. DOLLARS (US$100). Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.",
    ],
  },
  {
    id: "indemnification",
    title: "15. Indemnification",
    body: [
      "You will defend, indemnify, and hold harmless Exultia and its affiliates, officers, employees, and licensors from and against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of your Customer Content, your use of the Services in violation of these Terms or applicable law, or your deployment of any remediation, advisory, or configuration obtained through the Services.",
    ],
  },
  {
    id: "term",
    title: "16. Term, Suspension, and Termination",
    body: [
      "These Terms apply from your first use of the Services until terminated. You may stop using the Services and cancel your subscription at any time. We may suspend or terminate your access immediately if you breach these Terms, if required by law, or if your use poses a security risk or legal exposure to us or others.",
      "Upon termination, your license ends and you must cease using the Services and delete or return any proprietary materials as applicable. Sections that by their nature should survive (including intellectual property, confidentiality, disclaimers, limitation of liability, indemnification, and governing law) will survive termination.",
    ],
  },
  {
    id: "privacy",
    title: "17. Privacy",
    body: [
      "We collect only the information needed to operate the Services, such as account details, billing information, license activity, and service telemetry, and we do not embed advertising trackers in our software. We use reasonable administrative and technical safeguards but cannot guarantee absolute security of data transmitted over the internet.",
    ],
  },
  {
    id: "export",
    title: "18. Export and Compliance",
    body: [
      "You agree to comply with all applicable export control, sanctions, and anti-corruption laws. You represent that you are not located in, or a national or resident of, a jurisdiction subject to comprehensive sanctions, and that you are not on any applicable restricted-party list.",
    ],
  },
  {
    id: "governing-law",
    title: "19. Governing Law and Disputes",
    body: [
      "These Terms are governed by the laws of the United States and the state in which Exultia maintains its principal place of business, without regard to conflict-of-laws principles. The parties agree to first attempt in good faith to resolve any dispute informally. Any dispute not resolved informally will be brought exclusively in the state or federal courts located in that state, and each party consents to personal jurisdiction and venue there. To the extent permitted by law, each party waives any right to a jury trial and to participate in a class or representative action.",
    ],
  },
  {
    id: "general",
    title: "20. General Provisions",
    body: [
      { list: [
        "Entire agreement. These Terms, together with any order form or MSA signed by both parties, are the entire agreement regarding the Services and supersede all prior understandings. A signed MSA controls over these Terms in the event of conflict.",
        "Changes. We may update these Terms from time to time. Material changes will be posted on this page with a new \"Last updated\" date and, where practical, communicated by email or in-product notice. Continued use after changes take effect constitutes acceptance.",
        "Severability. If any provision is held unenforceable, the remaining provisions remain in full effect.",
        "No waiver. Failure to enforce any provision is not a waiver of our right to do so later.",
        "Assignment. You may not assign these Terms without our prior written consent. We may assign them in connection with a merger, acquisition, or sale of assets.",
        "Force majeure. Neither party is liable for delays or failures caused by events beyond its reasonable control.",
        "Notices. We may provide notices by posting on the Services or by email to the address associated with your account.",
      ] },
    ],
  },
  {
    id: "contact",
    title: "21. Contact",
    body: [
      "Questions about these Terms can be submitted through the support options in your account or via our AI Support Agent. Requests for a negotiated MSA or enterprise terms can be made from the Enterprise section of your subscription page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 1.5rem 5rem", color: "#CBD5E1" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#F8FAFC", margin: "0 0 0.5rem 0" }}>
          Terms of Service
        </h1>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#94A3B8" }}>Last updated: {LAST_UPDATED}</p>
      </header>

      <nav
        aria-label="Table of contents"
        style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 700, marginBottom: "0.75rem" }}>
          Contents
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.35rem 1.5rem" }}>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} style={{ color: "#93C5FD", textDecoration: "none", fontSize: "0.88rem" }}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} style={{ marginBottom: "2rem", scrollMarginTop: "5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#F8FAFC", margin: "0 0 0.75rem 0" }}>{s.title}</h2>
            {s.body.map((block, i) =>
              typeof block === "string" ? (
                <p key={i} style={{ margin: "0 0 0.85rem 0", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {block}
                </p>
              ) : (
                <ul key={i} style={{ margin: "0 0 0.85rem 0", paddingLeft: "1.25rem", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {block.list.map((item, j) => (
                    <li key={j} style={{ marginBottom: "0.4rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}
      </main>

      <footer style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.85rem", color: "#94A3B8" }}>
        <Link href="/account/subscription" style={{ color: "#93C5FD", textDecoration: "none" }}>
          Back to subscription plans
        </Link>
      </footer>
    </div>
  );
}
