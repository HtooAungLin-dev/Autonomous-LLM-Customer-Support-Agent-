import React, { useState } from 'react';
import { HeaderCard } from './components/HeaderCard';
import { LiveAgentChat } from './components/LiveAgentChat';
import { VectorStoreExplorer } from './components/VectorStoreExplorer';
import { AgenticWorkflowViewer } from './components/AgenticWorkflowViewer';
import { GuardrailsSafetyMatrix } from './components/GuardrailsSafetyMatrix';
import { MetricsDashboard } from './components/MetricsDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'console' | 'vector_store' | 'workflows' | 'guardrails' | 'metrics'>('console');

  return (
    <div id="app-root-container" className="min-h-screen bg-[#08070d] text-gray-100 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Exact Header Card from Screenshot */}
      <HeaderCard activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Body */}
      <main id="app-main-content" className="flex-1 pb-12">
        {activeTab === 'console' && <LiveAgentChat />}
        {activeTab === 'vector_store' && <VectorStoreExplorer />}
        {activeTab === 'workflows' && <AgenticWorkflowViewer />}
        {activeTab === 'guardrails' && <GuardrailsSafetyMatrix />}
        {activeTab === 'metrics' && <MetricsDashboard />}
      </main>

      {/* Enterprise System Footer */}
      <footer id="app-system-footer" className="border-t border-[#1b1430] bg-[#0a0812] py-4 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Autonomous LLM Customer Support Agent • Confidential Enterprise Deployment
          </span>
          <span className="font-mono text-purple-400/80">
            Pinecone v3 • LangChain • Guardrails v2.4 • Gemini 3.8 Flash
          </span>
        </div>
      </footer>
    </div>
  );
}
