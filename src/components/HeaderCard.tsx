import React from 'react';
import { Briefcase, Calendar, Users, Cpu, ShieldCheck, Sparkles, Terminal, Activity } from 'lucide-react';

interface HeaderCardProps {
  activeTab: 'console' | 'vector_store' | 'workflows' | 'guardrails' | 'metrics';
  onSelectTab: (tab: 'console' | 'vector_store' | 'workflows' | 'guardrails' | 'metrics') => void;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ activeTab, onSelectTab }) => {
  const technologies = [
    { name: 'LangChain', tag: 'Orchestration' },
    { name: 'Pinecone', tag: 'Vector DB' },
    { name: 'OpenAI APIs', tag: 'Foundation LLM' },
    { name: 'Agentic Workflows', tag: 'Architecture' },
    { name: 'Tool-Calling', tag: 'Function Execution' },
    { name: 'LLM Evaluation', tag: 'Ragas / Evals' },
    { name: 'Python', tag: 'FastAPI Backend' },
    { name: 'Node.js', tag: 'Full-Stack Runtime' },
  ];

  return (
    <div id="system-header-container" className="bg-[#0c0b13] border-b border-[#231b3d] px-6 sm:px-10 pt-8 pb-6 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-indigo-950/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h1 
          id="system-main-title" 
          className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight"
        >
          Autonomous LLM Customer Support Agent
        </h1>

        {/* Metadata sub-row */}
        <div id="system-meta-row" className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-sm text-[#a78bfa]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#c084fc]" />
            <span className="font-medium text-[#c4b5fd]">Agentic AI / Customer Operations</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c084fc]" />
            <span className="font-medium text-[#c4b5fd]">Apr 2025 - Present</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c084fc]" />
            <span className="font-medium text-[#c4b5fd]">Team of 3</span>
          </div>
        </div>

        {/* MY ROLE Section */}
        <div id="section-my-role" className="mt-8">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#a855f7] mb-1">
            MY ROLE
          </div>
          <p className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            Applied AI Engineer
          </p>
        </div>

        {/* SCOPE Section */}
        <div id="section-scope" className="mt-6">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#a855f7] mb-2">
            SCOPE
          </div>
          <p className="text-[#94a3b8] text-[15px] sm:text-base leading-relaxed max-w-5xl">
            Developed an LLM-powered customer support agent that retrieves pertinent context dynamically from a Pinecone vector store and generates strictly grounded, factual responses. Drastically reduced manual triage of routine support queries for a confidential enterprise client, establishing guardrails and safety evaluation frameworks suited for client-facing deployment.
          </p>
        </div>

        {/* TECHNOLOGIES Section */}
        <div id="section-technologies" className="mt-7">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#a855f7] mb-3">
            TECHNOLOGIES
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {technologies.map((tech) => (
              <span
                key={tech.name}
                id={`tech-badge-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#1d1435] text-[#d8b4fe] border border-[#3e236e] hover:border-[#8b5cf6] hover:bg-[#271b48] transition-all shadow-sm cursor-default"
                title={`${tech.name}: ${tech.tag}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <div id="system-tab-navigation" className="mt-8 pt-5 border-t border-[#1e1635] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#130f24] rounded-xl border border-[#2b1f4c]">
            <button
              id="tab-btn-console"
              onClick={() => onSelectTab('console')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'console'
                  ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f173b]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Agent Console
            </button>

            <button
              id="tab-btn-vector-store"
              onClick={() => onSelectTab('vector_store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'vector_store'
                  ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f173b]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Pinecone Vector Store
            </button>

            <button
              id="tab-btn-workflows"
              onClick={() => onSelectTab('workflows')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'workflows'
                  ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f173b]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Agentic Workflow & Tools
            </button>

            <button
              id="tab-btn-guardrails"
              onClick={() => onSelectTab('guardrails')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'guardrails'
                  ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f173b]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety & Guardrails
            </button>

            <button
              id="tab-btn-metrics"
              onClick={() => onSelectTab('metrics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'metrics'
                  ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f173b]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Triage Reduction & Metrics
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a78bfa]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">Pinecone: Ready • Guardrails: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
