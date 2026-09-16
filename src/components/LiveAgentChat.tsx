import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldCheck, Database, Wrench, CheckCircle2, AlertTriangle, ChevronRight, Sparkles, RefreshCw, Layers, ExternalLink } from 'lucide-react';
import { ChatMessage, TestScenario } from '../types';
import { TEST_SCENARIOS, ENTERPRISE_CUSTOMERS } from '../data/mockData';
import { executeAgentWorkflow } from '../utils/agentEngine';

export const LiveAgentChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('ACC-ACME');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTraceMsg, setSelectedTraceMsg] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello! I am your Autonomous Enterprise Customer Support Agent. 
I have real-time semantic access to our **Pinecone Vector Store** for grounded policies, active tool-calling pipelines for billing & SLA lookups, and dual-layer safety guardrails.

How can I assist you with your account or services today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreeting]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const agentReply = await executeAgentWorkflow(query, selectedCustomerId);
      setMessages(prev => [...prev, agentReply]);
      setSelectedTraceMsg(agentReply);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: 'An unexpected processing error occurred in the agent loop. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentCustomer = ENTERPRISE_CUSTOMERS[selectedCustomerId] || ENTERPRISE_CUSTOMERS['ACC-ACME'];

  return (
    <div id="live-chat-panel" className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left / Main Chat Section */}
      <div className="lg:col-span-7 flex flex-col h-[740px] bg-[#100e1b] rounded-2xl border border-[#2a1d4a] shadow-xl overflow-hidden">
        {/* Customer Context Header */}
        <div className="p-4 border-b border-[#241740] bg-[#140f24] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Autonomous Support Console</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40">
                  Grounded RAG v3.4
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Connected to Pinecone Index: <span className="text-purple-300 font-mono">enterprise-support-v3</span>
              </div>
            </div>
          </div>

          {/* Account Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Context:</span>
            <select
              id="customer-account-select"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-[#1d1633] text-purple-200 text-xs rounded-lg border border-[#3e2468] px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="ACC-ACME">Acme Cloud Dynamics (Platinum)</option>
              <option value="ACC-NEXUS">Nexus Global Retail (Gold)</option>
            </select>
          </div>
        </div>

        {/* Quick Test Scenarios Bar */}
        <div className="bg-[#17122b] px-4 py-2.5 border-b border-[#281b47] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-medium text-purple-300 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Test Scenarios:
          </span>
          {TEST_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSendMessage(scenario.prompt)}
              disabled={isProcessing}
              className="text-[11px] font-medium px-3 py-1 rounded-md bg-[#22183d] text-purple-200 hover:bg-[#322359] border border-[#3b2568] whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {scenario.title}
            </button>
          ))}
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                id={`chat-message-${msg.id}`}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#271a47] border border-[#482882] flex items-center justify-center shrink-0 text-purple-300 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#6d28d9] text-white rounded-tr-sm shadow-md'
                        : 'bg-[#1b1530] text-gray-200 border border-[#311f54] rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Grounding & Citations Indicator */}
                    {!isUser && msg.trace && (
                      <div className="mt-3 pt-2.5 border-t border-[#342259] flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Grounded: {msg.trace.groundednessScore}%
                          </span>

                          {msg.trace.toolCalls.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-[11px] font-medium">
                              <Wrench className="w-3 h-3 text-indigo-400" />
                              {msg.trace.toolCalls.length} Tool{msg.trace.toolCalls.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedTraceMsg(msg)}
                          className="text-purple-300 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
                        >
                          Inspect Agent Trace <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`text-[10px] text-gray-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-purple-900 border border-purple-700 flex items-center justify-center shrink-0 text-white mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3 items-center text-sm text-purple-300 bg-[#16102a] border border-[#321f57] p-3 rounded-xl max-w-md animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
              <span>Querying Pinecone vector store & executing agent guardrails...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#140f25] border-t border-[#271948]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="chat-user-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about refunds, SLA commitments, rate limits, or test red-team guardrails..."
              disabled={isProcessing}
              className="flex-1 bg-[#1d1635] text-white text-sm rounded-xl px-4 py-3 border border-[#3c236b] focus:outline-none focus:border-purple-500 placeholder-gray-500"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-medium flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Run Agent</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right / Agent Trace & Inspection Panel */}
      <div className="lg:col-span-5 flex flex-col h-[740px] bg-[#100e1b] rounded-2xl border border-[#2a1d4a] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#241740] bg-[#140f24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Agentic Execution Trace</h3>
          </div>
          {selectedTraceMsg?.trace && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
              {selectedTraceMsg.trace.totalDurationMs} ms
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedTraceMsg?.trace ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="w-12 h-12 rounded-2xl bg-[#1c1433] border border-[#3b2469] flex items-center justify-center text-purple-400 mb-3">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1">No Active Trace Selected</h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Select a message or trigger one of the test scenarios to inspect the step-by-step agentic loop, vector retrieval, and safety scores.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Triage Verdict Banner */}
              <div className="p-3.5 rounded-xl bg-[#19122e] border border-[#3b266b] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#a855f7]">Triage Verdict</div>
                  <div className="text-sm font-semibold text-white capitalize mt-0.5">
                    {selectedTraceMsg.trace.triageAction.replace(/_/g, ' ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">Groundedness</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {selectedTraceMsg.trace.groundednessScore}%
                  </div>
                </div>
              </div>

              {/* Step-by-Step Pipeline Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Execution Pipeline ({selectedTraceMsg.trace.steps.length} Steps)
                </div>

                {selectedTraceMsg.trace.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 rounded-xl bg-[#151026] border border-[#2b1b4b] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-medium text-white">{step.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{step.durationMs}ms</span>
                    </div>

                    {step.type === 'guardrail' && (
                      <div className="text-xs text-gray-300 pl-7 space-y-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Input Status: <span className="text-emerald-400 font-semibold">Passed & Sanitized</span></span>
                        </div>
                      </div>
                    )}

                    {step.type === 'retrieval' && (
                      <div className="text-xs text-gray-300 pl-7 space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-300">
                          <Database className="w-3.5 h-3.5" />
                          <span>Pinecone Index: <span className="font-mono text-white">enterprise-support-v3</span></span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Retrieved {step.data.matches.length} top-k candidate chunks (Cosine Metric).
                        </div>
                      </div>
                    )}

                    {step.type === 'tool_call' && (
                      <div className="text-xs text-gray-300 pl-7 space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-300">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Tools Executed: <span className="font-mono text-white">{step.data.toolsInvoked.join(', ') || 'None (Direct Response)'}</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Retrieved Pinecone Chunks */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    Pinecone Retrieved Chunks ({selectedTraceMsg.trace.vectorResults.length})
                  </div>
                </div>

                {selectedTraceMsg.trace.vectorResults.map((res, i) => (
                  <div
                    key={res.chunk.id}
                    className="p-3 rounded-xl bg-[#17112c] border border-[#35215c] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-200">[{i + 1}] {res.chunk.docTitle}</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/40 text-[10px]">
                        Cosine: {(res.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-purple-400 font-medium">
                      {res.chunk.metadata.section}
                    </div>
                    <p className="text-gray-300 text-[11px] line-clamp-3 bg-[#120d22] p-2 rounded border border-[#261742]">
                      "{res.chunk.text}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Tool Execution Details */}
              {selectedTraceMsg.trace.toolCalls.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                    Tool Invocations & Payload
                  </div>

                  {selectedTraceMsg.trace.toolCalls.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-3 rounded-xl bg-[#15102b] border border-[#36225e] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-purple-300 font-medium">{tool.toolName}()</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          {tool.status} ({tool.executionTimeMs}ms)
                        </span>
                      </div>
                      <div className="bg-[#100b21] p-2 rounded font-mono text-[10px] text-gray-300 overflow-x-auto">
                        <div className="text-purple-400 font-semibold mb-1">// Result:</div>
                        {JSON.stringify(tool.result, null, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
