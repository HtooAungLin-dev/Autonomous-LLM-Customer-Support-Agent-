export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'policy' | 'billing' | 'technical' | 'security' | 'sla';
  lastUpdated: string;
  source: string;
  content: string;
  chunkCount: number;
}

export interface VectorChunk {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  text: string;
  metadata: {
    section: string;
    authorityLevel: string;
    tokenCount: number;
    tags: string[];
  };
  embeddingPreview: number[]; // First few dimensions of 1536
}

export interface SimilarityResult {
  chunk: VectorChunk;
  score: number; // 0.00 to 1.00
  matchedKeywords: string[];
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
  executionTimeMs: number;
  status: 'success' | 'failed';
}

export interface GuardrailCheck {
  name: string;
  category: 'input' | 'output';
  status: 'passed' | 'flagged' | 'blocked';
  score: number; // 0-100
  details: string;
}

export interface AgentStepTrace {
  stepNumber: number;
  title: string;
  type: 'guardrail' | 'retrieval' | 'reasoning' | 'tool_call' | 'evaluation' | 'response';
  durationMs: number;
  data: any;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface Citation {
  chunkId: string;
  docTitle: string;
  section: string;
  excerpt: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  trace?: {
    totalDurationMs: number;
    vectorResults: SimilarityResult[];
    toolCalls: ToolCallExecution[];
    guardrails: GuardrailCheck[];
    steps: AgentStepTrace[];
    citations: Citation[];
    groundednessScore: number;
    triageAction: 'resolved_autonomous' | 'tool_assisted' | 'escalated_tier2';
    promptTokens?: number;
    completionTokens?: number;
  };
}

export interface TestScenario {
  id: string;
  title: string;
  category: 'Billing & Refund' | 'SLA & Escalation' | 'Security & Compliance' | 'Adversarial / Red Team';
  prompt: string;
  expectedOutcome: string;
  simulatedCustomer: {
    name: string;
    company: string;
    tier: string;
    orderId?: string;
  };
}
