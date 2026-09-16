import React, { useState } from 'react';
import { Terminal, Wrench, ArrowRight, Play, CheckCircle2, ShieldAlert, Cpu, Sparkles, Layers, Code, Bot } from 'lucide-react';
import { AGENT_TOOLS, ENTERPRISE_CUSTOMERS } from '../data/mockData';
import { AgentTool } from '../types';

export const AgenticWorkflowViewer: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<AgentTool>(AGENT_TOOLS[1]); // default: lookup_customer_account
  const [toolArgs, setToolArgs] = useState<string>('{\n  "account_id": "ACC-ACME"\n}');
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const pipelineSteps = [
    {
      step: '01',
      name: 'Input Guardrail Gate',
      tech: 'Python / Safety Middleware',
      desc: 'Intercepts adversarial prompt injections, jailbreaks, and sanitizes incoming PII credentials.'
    },
    {
      step: '02',
      name: 'Semantic Intent Router',
      tech: 'LangChain RouterRunnable',
      desc: 'Classifies domain context: Billing Refund, SLA Outage, Technical Limits, or Policy Q&A.'
    },
    {
      step: '03',
      name: 'Pinecone Vector Retrieval',
      tech: 'Pinecone Index v3 (Cosine)',
      desc: 'Dynamic similarity search yielding top-3 factual chunks with similarity score threshold > 0.65.'
    },
    {
      step: '04',
      name: 'Agentic Tool-Calling Loop',
      tech: 'LangChain AgentExecutor / Tool-Calling',
      desc: 'Evaluates function definitions; executes internal database, billing proration, or SRE dispatch.'
    },
    {
      step: '05',
      name: 'Grounded LLM Generation',
      tech: 'OpenAI / Gemini 3.8 Flash',
      desc: 'Strictly grounded prompt synthesis injecting retrieved passages and tool execution payloads.'
    },
    {
      step: '06',
      name: 'Safety & Faithfulness Eval',
      tech: 'Ragas / Output Guardrails',
      desc: 'Validates factual assertions against source passages; checks hallucination risk and brand tone.'
    }
  ];

  const handleExecuteTool = () => {
    setIsExecuting(true);
    setToolOutput(null);

    setTimeout(() => {
      try {
        const parsed = JSON.parse(toolArgs);
        let result: any = {};

        if (selectedTool.name === 'lookup_customer_account') {
          const accId = parsed.account_id || 'ACC-ACME';
          result = ENTERPRISE_CUSTOMERS[accId] || { error: 'Account not found' };
        } else if (selectedTool.name === 'calculate_refund_proration') {
          const amount = parsed.requested_amount || 4800;
          const day = parsed.cancellation_day || 15;
          const is30Day = day <= 30;
          result = {
            order_id: parsed.order_id || 'ORD-84920',
            days_elapsed: day,
            guarantee_applied: is30Day ? '30-Day 100% Guarantee' : '31-90 Day Proration (-5% Fee)',
            admin_fee_charged: is30Day ? 0 : amount * 0.05,
            calculated_refund: is30Day ? amount : amount * 0.95,
            approval_tier: (is30Day ? amount : amount * 0.95) >= 5000 ? 'Customer Operations Director Dual Signoff' : 'Autonomous Agent Authorized'
          };
        } else if (selectedTool.name === 'escalate_to_human_tier2') {
          result = {
            status: 'DISPATCHED_TO_PAGERDUTY',
            incident_id: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
            severity: parsed.severity || 'P0_CRITICAL',
            target_rotation: parsed.target_team || 'sre_oncall',
            sla_response_due_minutes: 15,
            ack_status: 'On-Call Engineer Paged'
          };
        } else {
          result = {
            query: parsed.query || 'refund policy',
            status: 'success',
            vectors_scanned: 42840,
            matched_chunks: 3
          };
        }

        setToolOutput(JSON.stringify(result, null, 2));
      } catch (err: any) {
        setToolOutput(JSON.stringify({ error: 'JSON Parse Error', details: err.message }, null, 2));
      } finally {
        setIsExecuting(false);
      }
    }, 280);
  };

  return (
    <div id="agentic-workflows-container" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Visual Pipeline Flow Diagram */}
      <div className="bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#241740] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              Autonomous Agent Execution Architecture
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              End-to-end LangChain orchestration connecting Pinecone vector retrieval, function tool-calling, and evaluation guardrails.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800 self-start">
            Agentic State Graph v2.8
          </span>
        </div>

        {/* Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((s, idx) => (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-[#151026] border border-[#2a1a4a] hover:border-purple-600/60 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#a855f7] bg-[#22163d] px-2 py-0.5 rounded border border-[#3b236b]">
                    Step {s.step}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Stage {idx + 1}/6</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">{s.name}</h3>
                <div className="text-[11px] text-purple-300 font-medium font-mono mt-0.5">{s.tech}</div>
                <p className="text-xs text-gray-300 leading-relaxed mt-2">{s.desc}</p>
              </div>

              <div className="pt-2 border-t border-[#23153d] flex items-center justify-between text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Validated Node
                </span>
                <span className="text-gray-500 font-mono">avg ~18ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tool-Calling Inspector & Playground */}
      <div className="bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-400" />
            Agent Tool-Calling Registry & Payload Execution Sandbox
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Test how the autonomous agent selects and executes tools during user interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Registered Tools ({AGENT_TOOLS.length})
            </div>
            {AGENT_TOOLS.map((tool) => {
              const isSelected = selectedTool.name === tool.name;
              return (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedTool(tool);
                    if (tool.name === 'lookup_customer_account') {
                      setToolArgs('{\n  "account_id": "ACC-ACME"\n}');
                    } else if (tool.name === 'calculate_refund_proration') {
                      setToolArgs('{\n  "order_id": "ORD-84920",\n  "cancellation_day": 15,\n  "requested_amount": 4800\n}');
                    } else if (tool.name === 'escalate_to_human_tier2') {
                      setToolArgs('{\n  "severity": "P0_CRITICAL",\n  "reason": "Production API outage >50 users",\n  "target_team": "sre_oncall"\n}');
                    } else {
                      setToolArgs('{\n  "query": "30-day refund policy",\n  "top_k": 3\n}');
                    }
                    setToolOutput(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#22163f] border-purple-600 shadow-md text-white'
                      : 'bg-[#140f25] border-[#291b48] text-gray-300 hover:bg-[#1a1332] hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-purple-200">{tool.name}()</div>
                  <div className="text-[11px] text-gray-400 line-clamp-2 mt-1">{tool.description}</div>
                </button>
              );
            })}
          </div>

          {/* Tool Payload & Execution Playground */}
          <div className="lg:col-span-8 flex flex-col space-y-4 bg-[#140f24] p-4 sm:p-5 rounded-xl border border-[#2b1b4c]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-white">{selectedTool.name}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{selectedTool.description}</span>
              </div>
              <button
                onClick={handleExecuteTool}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-800 text-white text-xs font-bold shadow-md shadow-purple-950 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isExecuting ? 'Executing Tool...' : 'Invoke Tool'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Arguments JSON Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" /> Arguments (JSON)
                </label>
                <textarea
                  rows={9}
                  value={toolArgs}
                  onChange={(e) => setToolArgs(e.target.value)}
                  className="w-full bg-[#1b1433] text-purple-200 font-mono text-xs rounded-xl p-3 border border-[#3b2468] focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Execution Output */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> Execution Result (JSON)
                </label>
                <div className="h-[188px] bg-[#100b21] text-emerald-300 font-mono text-xs rounded-xl p-3 border border-[#281944] overflow-y-auto whitespace-pre">
                  {toolOutput ? (
                    toolOutput
                  ) : (
                    <span className="text-gray-500 italic">// Click 'Invoke Tool' to run simulated function execution...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
