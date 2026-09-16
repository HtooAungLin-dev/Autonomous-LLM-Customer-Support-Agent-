import { KnowledgeDocument, VectorChunk } from '../types';

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-refund-01',
    title: 'Enterprise Refund & Cancellation Policy',
    category: 'billing',
    lastUpdated: '2025-03-15',
    source: 'internal://legal/policies/billing-refund-v4.2',
    chunkCount: 3,
    content: `All Enterprise SaaS subscriptions come with a 30-day money-back guarantee from the initial contract signing date. 
If an enterprise client cancels between day 31 and day 90, refunds are strictly calculated on a pro-rata basis minus a 5% administrative provisioning fee.
Cancellations after day 90 are non-refundable, but remaining credits may be converted into professional services hours.
Refunds exceeding $5,000 USD require dual approval from the Customer Operations Director and cannot be processed autonomously without human escalation.`
  },
  {
    id: 'doc-sla-02',
    title: 'Enterprise SLA & Support Tier Commitments',
    category: 'sla',
    lastUpdated: '2025-02-28',
    source: 'internal://ops/sla-tier-matrix-2025',
    chunkCount: 4,
    content: `Platinum Tier customers are entitled to a guaranteed 15-minute response time for P0 (Critical Outage) incidents, and 1-hour response for P1 (Major Degradation).
Gold Tier customers receive 1-hour P0 response and 4-hour P1 response. Standard Business tier provides next-business-day response.
If uptime falls below 99.95% in any calendar month, Platinum clients automatically receive a 15% service credit on the subsequent invoice.
Autonomous agents must immediately route any reported P0 outage affecting more than 50 end-users directly to the on-call Site Reliability Engineer.`
  },
  {
    id: 'doc-security-03',
    title: 'Security, Compliance & Data Privacy Guidelines',
    category: 'security',
    lastUpdated: '2025-04-01',
    source: 'internal://infosec/compliance/soc2-gdpr-data-handling',
    chunkCount: 3,
    content: `Our infrastructure maintains SOC 2 Type II certification, ISO 27001, and HIPAA BAA compliance.
Customer data is encrypted at rest using AES-256 and in transit via TLS 1.3.
Customer Support Agents must never request, log, or repeat sensitive Personally Identifiable Information (PII) such as full credit card numbers, passwords, or national tax IDs.
Under GDPR Article 17 (Right to Erasure), data deletion requests must be acknowledged within 24 hours and verified via two-factor customer email verification before database purge execution.`
  },
  {
    id: 'doc-technical-04',
    title: 'API Rate Limits, Quotas & Burst Architecture',
    category: 'technical',
    lastUpdated: '2025-03-20',
    source: 'internal://engineering/api/gateway-rate-limiting-spec',
    chunkCount: 3,
    content: `Enterprise Tier accounts have a baseline rate limit of 10,000 requests per minute (RPM) with a burst capacity of 15,000 RPM for up to 5 consecutive minutes.
HTTP 429 'Too Many Requests' responses include the 'Retry-After' header and 'X-RateLimit-Reset' timestamp in epoch seconds.
Clients encountering 429 errors should implement truncated exponential backoff with full jitter.
Burst limits can be temporarily raised up to 50,000 RPM for scheduled load testing by submitting an API Provisioning Request at least 48 hours in advance.`
  },
  {
    id: 'doc-sso-05',
    title: 'Single Sign-On (SSO) & SCIM Directory Provisioning',
    category: 'technical',
    lastUpdated: '2025-01-10',
    source: 'internal://engineering/auth/sso-scim-troubleshooting',
    chunkCount: 2,
    content: `Enterprise SSO supports SAML 2.0 and OIDC identity providers including Okta, Microsoft Entra ID (Azure AD), Google Workspace, and PingFederate.
SCIM 2.0 automated user provisioning synchronizes user status every 15 minutes.
Common error AADSTS50011 (The reply URL specified in the request does not match) indicates an ACS URL discrepancy between the enterprise portal and the identity provider configuration.`
  }
];

export const INITIAL_CHUNKS: VectorChunk[] = [
  {
    id: 'vec-ref-01',
    docId: 'doc-refund-01',
    docTitle: 'Enterprise Refund & Cancellation Policy',
    category: 'billing',
    text: 'All Enterprise SaaS subscriptions come with a 30-day money-back guarantee from initial contract signing date. Between day 31 and day 90, refunds are calculated on a pro-rata basis minus a 5% administrative fee.',
    metadata: {
      section: 'Section 1.1: 30-Day Guarantee & Pro-rata Terms',
      authorityLevel: 'Executive Binding',
      tokenCount: 42,
      tags: ['refund', 'cancellation', 'money-back', 'billing']
    },
    embeddingPreview: [0.0412, -0.0891, 0.1245, -0.0152, 0.0734, 0.0381, -0.0912, 0.1143]
  },
  {
    id: 'vec-ref-02',
    docId: 'doc-refund-01',
    docTitle: 'Enterprise Refund & Cancellation Policy',
    category: 'billing',
    text: 'Refunds exceeding $5,000 USD require dual approval from the Customer Operations Director and cannot be processed autonomously without human escalation. Cancellations after day 90 are non-refundable, but remaining credits may be converted into professional services hours.',
    metadata: {
      section: 'Section 1.3: Approval Thresholds & Post-90 Days',
      authorityLevel: 'Executive Binding',
      tokenCount: 46,
      tags: ['refund', 'approval', 'escalation', 'threshold']
    },
    embeddingPreview: [0.0389, -0.0712, 0.0981, 0.0421, 0.0611, 0.0198, -0.0823, 0.0954]
  },
  {
    id: 'vec-sla-01',
    docId: 'doc-sla-02',
    docTitle: 'Enterprise SLA & Support Tier Commitments',
    category: 'sla',
    text: 'Platinum Tier customers are entitled to a guaranteed 15-minute response time for P0 (Critical Outage) incidents, and 1-hour response for P1 (Major Degradation). Gold Tier customers receive 1-hour P0 response and 4-hour P1 response.',
    metadata: {
      section: 'Section 2.1: Response Times by SLA Tier',
      authorityLevel: 'Operational SLA',
      tokenCount: 49,
      tags: ['sla', 'response-time', 'platinum', 'gold', 'p0', 'p1']
    },
    embeddingPreview: [0.0812, 0.0234, -0.0412, 0.0912, 0.0312, -0.0542, 0.0721, -0.0118]
  },
  {
    id: 'vec-sla-02',
    docId: 'doc-sla-02',
    docTitle: 'Enterprise SLA & Support Tier Commitments',
    category: 'sla',
    text: 'If uptime falls below 99.95% in any calendar month, Platinum clients automatically receive a 15% service credit on the subsequent invoice. Autonomous agents must immediately route any reported P0 outage affecting more than 50 end-users directly to the on-call Site Reliability Engineer.',
    metadata: {
      section: 'Section 2.3: Outage Escalation & Service Credits',
      authorityLevel: 'Operational SLA',
      tokenCount: 52,
      tags: ['uptime', 'service-credit', 'escalation', 'outage', 'sre']
    },
    embeddingPreview: [0.0765, 0.0198, -0.0387, 0.0881, 0.0298, -0.0489, 0.0682, -0.0094]
  },
  {
    id: 'vec-sec-01',
    docId: 'doc-security-03',
    docTitle: 'Security, Compliance & Data Privacy Guidelines',
    category: 'security',
    text: 'Our infrastructure maintains SOC 2 Type II certification, ISO 27001, and HIPAA BAA compliance. Customer data is encrypted at rest using AES-256 and in transit via TLS 1.3.',
    metadata: {
      section: 'Section 3.1: Certifications & Encryption Standard',
      authorityLevel: 'Compliance Mandatory',
      tokenCount: 38,
      tags: ['soc2', 'hipaa', 'iso27001', 'encryption', 'aes256', 'tls']
    },
    embeddingPreview: [-0.0124, 0.0945, 0.0512, -0.0823, 0.1189, 0.0421, 0.0319, -0.0654]
  },
  {
    id: 'vec-sec-02',
    docId: 'doc-security-03',
    docTitle: 'Security, Compliance & Data Privacy Guidelines',
    category: 'security',
    text: 'Customer Support Agents must never request, log, or repeat sensitive Personally Identifiable Information (PII) such as full credit card numbers, passwords, or national tax IDs. Under GDPR Article 17, data deletion requests must be acknowledged within 24 hours.',
    metadata: {
      section: 'Section 3.4: PII Masking & GDPR Erasure',
      authorityLevel: 'Compliance Mandatory',
      tokenCount: 47,
      tags: ['pii', 'gdpr', 'erasure', 'privacy', 'credit-card', 'guardrails']
    },
    embeddingPreview: [-0.0087, 0.0889, 0.0478, -0.0765, 0.1098, 0.0387, 0.0289, -0.0598]
  },
  {
    id: 'vec-rate-01',
    docId: 'doc-technical-04',
    docTitle: 'API Rate Limits, Quotas & Burst Architecture',
    category: 'technical',
    text: 'Enterprise Tier accounts have a baseline rate limit of 10,000 requests per minute (RPM) with a burst capacity of 15,000 RPM for up to 5 consecutive minutes. HTTP 429 responses include Retry-After header and X-RateLimit-Reset timestamp.',
    metadata: {
      section: 'Section 4.1: Tier Quotas & 429 Header Format',
      authorityLevel: 'Technical Architecture',
      tokenCount: 45,
      tags: ['api', 'rate-limit', 'rpm', '429', 'burst', 'headers']
    },
    embeddingPreview: [0.0623, -0.0412, -0.0921, 0.0154, -0.0389, 0.1145, 0.0452, 0.0781]
  },
  {
    id: 'vec-rate-02',
    docId: 'doc-technical-04',
    docTitle: 'API Rate Limits, Quotas & Burst Architecture',
    category: 'technical',
    text: 'Clients encountering 429 errors should implement truncated exponential backoff with full jitter. Burst limits can be temporarily raised up to 50,000 RPM for scheduled load testing by submitting an API Provisioning Request 48 hours in advance.',
    metadata: {
      section: 'Section 4.3: Exponential Backoff & Temporary Limit Elevation',
      authorityLevel: 'Technical Architecture',
      tokenCount: 44,
      tags: ['backoff', 'jitter', 'load-testing', 'burst-raise', 'provisioning']
    },
    embeddingPreview: [0.0589, -0.0387, -0.0876, 0.0132, -0.0354, 0.1089, 0.0412, 0.0734]
  },
  {
    id: 'vec-sso-01',
    docId: 'doc-sso-05',
    docTitle: 'Single Sign-On (SSO) & SCIM Directory Provisioning',
    category: 'technical',
    text: 'Enterprise SSO supports SAML 2.0 and OIDC identity providers including Okta, Microsoft Entra ID (Azure AD), Google Workspace, and PingFederate. SCIM 2.0 automated user provisioning synchronizes user status every 15 minutes.',
    metadata: {
      section: 'Section 5.1: Supported Identity Providers & SCIM Interval',
      authorityLevel: 'Technical Architecture',
      tokenCount: 43,
      tags: ['sso', 'saml', 'oidc', 'okta', 'azure-ad', 'scim']
    },
    embeddingPreview: [0.0198, 0.0645, -0.0521, 0.0412, 0.0876, -0.0312, -0.0789, 0.0452]
  }
];
