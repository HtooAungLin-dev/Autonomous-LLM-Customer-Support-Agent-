import { ENTERPRISE_CUSTOMERS } from '../data/mockData';
import { AgentStepTrace, ChatMessage, Citation, ToolCallExecution } from '../types';
import { safetyEngine } from './guardrails';
import { pineconeSimulator } from './vectorStore';

export async function executeAgentWorkflow(
  userQuery: string,
  customerAccountId = 'ACC-ACME'
): Promise<ChatMessage> {
  const steps: AgentStepTrace[] = [];
  const toolCalls: ToolCallExecution[] = [];
  const citations: Citation[] = [];
  const startTime = Date.now();

  // STEP 1: Guardrail Pre-Check
  const step1Start = Date.now();
  const inputEval = safetyEngine.evaluateInput(userQuery);
  steps.push({
    stepNumber: 1,
    title: 'Guardrail Pre-Screening & Input Sanitization',
    type: 'guardrail',
    durationMs: Date.now() - step1Start + 18,
    data: {
      checks: inputEval.checks,
      sanitizedInput: inputEval.sanitizedPrompt,
      isSafe: inputEval.isSafe
    },
    status: inputEval.isSafe ? 'completed' : 'failed'
  });

  // Handle immediate rejection if adversarial jailbreak
  if (!inputEval.isSafe) {
    const totalDuration = Date.now() - startTime;
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `⚠️ [Safety Guardrail Triggered]: Your request was intercepted by the Enterprise Security Gateway.

Reason: Adversarial instruction or unauthorized system override detected.
Action: The Autonomous Support Agent operates under strict operational guardrails and cannot bypass policy directives or disclose internal credentials.

If you have a legitimate enterprise inquiry regarding your contract, SLA tier, or API limits, please rephrase your request.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trace: {
        totalDurationMs: totalDuration,
        vectorResults: [],
        toolCalls: [],
        guardrails: inputEval.checks,
        steps,
        citations: [],
        groundednessScore: 100,
        triageAction: 'resolved_autonomous'
      }
    };
  }

  // STEP 2: Intent Classification & Pinecone Vector Store Retrieval
  const step2Start = Date.now();
  const vectorResults = pineconeSimulator.query(inputEval.sanitizedPrompt, 3);
  steps.push({
    stepNumber: 2,
    title: 'Dynamic Pinecone Vector Store Retrieval (Cosine Similarity)',
    type: 'retrieval',
    durationMs: Date.now() - step2Start + 84,
    data: {
      index: 'enterprise-support-v3',
      namespace: 'kb-production',
      topK: 3,
      matches: vectorResults.map(r => ({
        chunkId: r.chunk.id,
        document: r.chunk.docTitle,
        section: r.chunk.metadata.section,
        similarityScore: r.score
      }))
    },
    status: 'completed'
  });

  // Extract citations from top results
  for (const match of vectorResults) {
    if (match.score > 0.65) {
      citations.push({
        chunkId: match.chunk.id,
        docTitle: match.chunk.docTitle,
        section: match.chunk.metadata.section,
        excerpt: match.chunk.text,
        confidence: match.score
      });
    }
  }

  // STEP 3: Agentic Reasoning & Tool-Calling Selection
  const step3Start = Date.now();
  const queryLower = inputEval.sanitizedPrompt.toLowerCase();
  let triageAction: 'resolved_autonomous' | 'tool_assisted' | 'escalated_tier2' = 'resolved_autonomous';

  // Tool 1: Account / Order verification
  if (queryLower.includes('order') || queryLower.includes('cancel') || queryLower.includes('ord-') || queryLower.includes('refund') || queryLower.includes('tier') || queryLower.includes('outage')) {
    const customer = ENTERPRISE_CUSTOMERS[customerAccountId] || ENTERPRISE_CUSTOMERS['ACC-ACME'];
    toolCalls.push({
      id: `tool-call-${Date.now()}-1`,
      toolName: 'lookup_customer_account',
      arguments: { account_id: customerAccountId },
      result: {
        company: customer.company,
        tier: customer.tier,
        contractStart: customer.contractStart,
        openOrders: customer.openOrders
      },
      executionTimeMs: 42,
      status: 'success'
    });
  }

  // Tool 2: Refund calculation tool
  if (queryLower.includes('refund') || queryLower.includes('cancel') || queryLower.includes('4,800') || queryLower.includes('$4800')) {
    const orderAmount = 4800;
    // Assume 20 days since contract start (March 1 to current) -> within 30-day money-back guarantee
    const daysElapsed = 15;
    const isWithin30Days = daysElapsed <= 30;
    const adminFeePct = isWithin30Days ? 0 : 5;
    const eligibleAmount = isWithin30Days ? orderAmount : orderAmount * 0.95;
    const requiresDualApproval = eligibleAmount >= 5000;

    toolCalls.push({
      id: `tool-call-${Date.now()}-2`,
      toolName: 'calculate_refund_proration',
      arguments: {
        order_id: 'ORD-84920',
        cancellation_day: daysElapsed,
        requested_amount: orderAmount
      },
      result: {
        order_id: 'ORD-84920',
        daysElapsed,
        policyWindow: isWithin30Days ? '30-Day Money-Back Guarantee' : '31-90 Day Proration',
        adminFee: isWithin30Days ? '$0 (100% full refund)' : `$${orderAmount * 0.05} (5% administrative fee)`,
        approvedRefundAmount: eligibleAmount,
        requiresDualApproval,
        approvalAuthority: requiresDualApproval ? 'Customer Operations Director' : 'Autonomous Agent Allowed'
      },
      executionTimeMs: 38,
      status: 'success'
    });
    triageAction = 'tool_assisted';
  }

  // Tool 3: Human Escalation Tool (P0 / Critical Outage)
  if (queryLower.includes('critical') || queryLower.includes('outage') || (queryLower.includes('down') && (queryLower.includes('500') || queryLower.includes('production')))) {
    toolCalls.push({
      id: `tool-call-${Date.now()}-3`,
      toolName: 'escalate_to_human_tier2',
      arguments: {
        severity: 'P0_CRITICAL',
        reason: 'Customer reported production outage affecting >50 active users with HTTP 500 errors. Platinum SLA response target: 15 minutes.',
        target_team: 'sre_oncall'
      },
      result: {
        ticketId: `INC-P0-${Math.floor(100000 + Math.random() * 900000)}`,
        dispatchedTo: 'SRE-Duty-Rotation-APAC',
        slaTargetMinutes: 15,
        pagerAlertTriggered: true,
        incidentManager: 'Marcus Brody (On-Call Lead)'
      },
      executionTimeMs: 65,
      status: 'success'
    });
    triageAction = 'escalated_tier2';
  }

  steps.push({
    stepNumber: 3,
    title: 'Agentic Tool Selection & Execution Loop',
    type: 'tool_call',
    durationMs: Date.now() - step3Start + 45,
    data: {
      toolsInvoked: toolCalls.map(t => t.toolName),
      toolResults: toolCalls
    },
    status: 'completed'
  });

  // STEP 4: Server-side Gemini API or High-Fidelity Grounded Generation
  const step4Start = Date.now();
  let generatedContent = '';

  // Try calling server-side Gemini API first
  try {
    const apiRes = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: inputEval.sanitizedPrompt,
        retrievedContext: vectorResults.map(r => ({
          title: r.chunk.docTitle,
          section: r.chunk.metadata.section,
          text: r.chunk.text
        })),
        toolResults: toolCalls.map(t => ({ tool: t.toolName, result: t.result })),
        customerContext: ENTERPRISE_CUSTOMERS[customerAccountId] || ENTERPRISE_CUSTOMERS['ACC-ACME']
      })
    });

    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData.reply) {
        generatedContent = apiData.reply;
      }
    }
  } catch {
    // Graceful fallback to deterministic high-precision grounded synthesis
  }

  // If server is unavailable or returned empty, generate strictly grounded response from Pinecone context
  if (!generatedContent) {
    if (toolCalls.some(t => t.toolName === 'escalate_to_human_tier2')) {
      const escTool = toolCalls.find(t => t.toolName === 'escalate_to_human_tier2')!;
      generatedContent = `🚨 **Critical P0 Incident Acknowledged & Escalated**

Thank you for reporting this issue, Sarah. Because your account is on the **Platinum Enterprise Tier**, our guaranteed response SLA is **15 minutes** for P0 outages affecting production environments [1].

**Actions Taken Immediately:**
1. **P0 Ticket Created:** Incident **${escTool.result.ticketId}** has been generated with priority P0_CRITICAL.
2. **SRE On-Call Dispatched:** The alert has paged **${escTool.result.dispatchedTo}** (Lead: ${escTool.result.incidentManager}) with your telemetry details.
3. **SLA Protection:** Under Section 2.3 of your Enterprise Agreement, our Site Reliability Engineering team is actively triaging the root cause. If monthly uptime drops below 99.95%, a 15% service credit will be automatically applied to your subsequent billing invoice [2].

You can track real-time incident progress directly on your Enterprise Status Dashboard. An SRE will comment on Incident ${escTool.result.ticketId} within the 15-minute window.`;
    } else if (toolCalls.some(t => t.toolName === 'calculate_refund_proration')) {
      const refundTool = toolCalls.find(t => t.toolName === 'calculate_refund_proration')!;
      generatedContent = `Hello Sarah,

I have verified your account (**Acme Cloud Dynamics**) and reviewed your contract dates against our **Enterprise Refund & Cancellation Policy** [1].

**Refund Assessment for Order #ORD-84920 ($4,800 USD):**
- **Eligibility Window:** Your contract and order date fell within the **30-day money-back guarantee** window (15 days elapsed) [1].
- **Deduction Fee:** **0% deduction** ($0 fee). The 5% administrative provisioning fee only applies to cancellations requested between day 31 and day 90 [1].
- **Approved Refund Amount:** **$4,800.00 USD** (100% full refund).
- **Authorization Authority:** Because the requested refund is $4,800 (under the $5,000 threshold requiring Customer Operations Director dual approval [2]), I can immediately authorize this refund processing to your original payment method.

Would you like me to proceed with the cancellation and dispatch the credit memo receipt to **sarah.chen@acmecorp.com**?`;
    } else if (inputEval.piiDetected) {
      generatedContent = `🔒 **Security Notice: Credit Card Interception**

For your security and in compliance with our **SOC 2 Type II and PCI-DSS data handling policies** [1], sensitive financial credentials (such as credit card numbers and CVV codes) have been automatically redacted and are never logged or stored in chat transcripts [2].

**To update your payment method securely:**
1. Log in to your authenticated enterprise billing portal at \`https://portal.enterprise.internal/billing\`.
2. Navigate to **Billing Settings > Payment Methods**.
3. Add your new card through our tokenized PCI-compliant gateway.

Our autonomous agents do not store raw card numbers. Please let me know if you need assistance generating an administrative invite to your billing team!`;
    } else if (queryLower.includes('429') || queryLower.includes('rate') || queryLower.includes('burst')) {
      generatedContent = `Hello Sarah,

According to our **API Rate Limits, Quotas & Burst Architecture** specifications [1]:

1. **Current Enterprise Limits:**
   - **Baseline Quota:** 10,000 requests per minute (RPM) [1].
   - **Burst Capacity:** Up to 15,000 RPM allowed for up to 5 consecutive minutes before throttling [1].

2. **Handling HTTP 429 Errors:**
   - HTTP 429 responses include the \`Retry-After\` header and the \`X-RateLimit-Reset\` epoch timestamp [1].
   - We recommend implementing **truncated exponential backoff with full jitter** to smoothly distribute retry traffic during peak loads [2].

3. **Temporary Limit Increases:**
   - If you anticipate scheduled peak loads or load testing, your burst limits can be temporarily raised up to **50,000 RPM**.
   - Simply submit an **API Provisioning Request** via the portal at least **48 hours in advance** [2].`;
    } else {
      // General grounded fallback using top chunks
      const topChunk = vectorResults[0]?.chunk;
      generatedContent = `Based on our enterprise documentation regarding **${topChunk ? topChunk.docTitle : 'Enterprise Services'}** [1]:

${topChunk ? topChunk.text : 'Our enterprise platform provides 99.95% uptime SLA, SOC-2 Type II compliance, and dedicated engineering support.'}

Please let me know if you would like me to retrieve additional technical parameters or connect with your designated account manager.`;
    }
  }

  steps.push({
    stepNumber: 4,
    title: 'Grounded LLM Response Generation (Strict Context Injection)',
    type: 'response',
    durationMs: Date.now() - step4Start + 112,
    data: {
      citationsGenerated: citations.length,
      responseLengthChars: generatedContent.length
    },
    status: 'completed'
  });

  // STEP 5: Output Guardrail & Safety Evaluation
  const step5Start = Date.now();
  const outputEval = safetyEngine.evaluateOutput(generatedContent, vectorResults);
  steps.push({
    stepNumber: 5,
    title: 'Safety Evaluation & Hallucination Guardrail (Post-Screening)',
    type: 'evaluation',
    durationMs: Date.now() - step5Start + 22,
    data: {
      groundednessScore: outputEval.groundednessScore,
      hallucinationRisk: outputEval.hallucinationRisk,
      checks: outputEval.checks
    },
    status: 'completed'
  });

  const totalDuration = Date.now() - startTime;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: generatedContent,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    trace: {
      totalDurationMs: totalDuration,
      vectorResults,
      toolCalls,
      guardrails: [...inputEval.checks, ...outputEval.checks],
      steps,
      citations,
      groundednessScore: outputEval.groundednessScore,
      triageAction,
      promptTokens: Math.floor(userQuery.length / 4) + 420,
      completionTokens: Math.floor(generatedContent.length / 4)
    }
  };
}
