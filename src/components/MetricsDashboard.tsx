import React from 'react';
import { Activity, TrendingDown, Clock, ShieldCheck, ThumbsUp, Zap, Users, CheckCircle2, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const MetricsDashboard: React.FC = () => {
  const kpis = [
    {
      title: 'Manual Triage Reduction',
      value: '-84.2%',
      subtitle: 'From 420 hrs/mo to 67 hrs/mo human triage',
      trend: 'down_good',
      icon: TrendingDown,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60'
    },
    {
      title: 'Grounding & Factuality Accuracy',
      value: '99.1%',
      subtitle: 'Verified via Pinecone vector retrieval evals',
      trend: 'up_good',
      icon: ShieldCheck,
      color: 'text-purple-300',
      bg: 'bg-purple-950/40 border-purple-800/60'
    },
    {
      title: 'Mean Response Latency',
      value: '1.42s',
      subtitle: 'Down from 4.2 hours human response median',
      trend: 'down_good',
      icon: Clock,
      color: 'text-sky-300',
      bg: 'bg-sky-950/40 border-sky-800/60'
    },
    {
      title: 'Customer Satisfaction (CSAT)',
      value: '94.7%',
      subtitle: 'Across 14,200+ monthly enterprise interactions',
      trend: 'up_good',
      icon: ThumbsUp,
      color: 'text-amber-300',
      bg: 'bg-amber-950/40 border-amber-800/60'
    }
  ];

  const categoryBreakdown = [
    { name: 'Billing & Refund Calculations', percent: 38, count: '5,410 queries', automated: '94%' },
    { name: 'SLA Outage & P0/P1 Routing', percent: 24, count: '3,418 queries', automated: '100% Paged to SRE' },
    { name: 'API Rate Limits & Technical Limits', percent: 21, count: '2,990 queries', automated: '91%' },
    { name: 'Security, SSO & Compliance Policies', percent: 17, count: '2,420 queries', automated: '88%' }
  ];

  return (
    <div id="metrics-dashboard-container" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#100e1b] border border-[#2b1d4e] shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{kpi.value}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                {kpi.trend === 'down_good' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{kpi.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Breakdown & Operational Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Triage Distribution Chart */}
        <div className="lg:col-span-7 bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Query Triage & Resolution Distribution
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Breakdown of autonomous agent decisions across enterprise customer support queries.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">
              14,238 queries/mo
            </span>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-white mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Fully Resolved via Grounded Pinecone RAG
                </span>
                <span className="font-mono text-purple-300 font-bold">62.0% (8,827 tickets)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1e1538] overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Tool-Augmented Autonomous Execution (Refunds, Lookups)
                </span>
                <span className="font-mono text-indigo-300 font-bold">22.2% (3,160 tickets)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1e1538] overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '22.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-white mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Escalated to Tier-2 SRE / Operations Director
                </span>
                <span className="font-mono text-amber-300 font-bold">15.8% (2,251 tickets)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1e1538] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '15.8%' }} />
              </div>
            </div>
          </div>

          {/* Operational Takeaway */}
          <div className="p-4 rounded-xl bg-[#16102a] border border-[#2e1d52] flex items-start gap-3 mt-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Overall Automation Rate: 84.2%</strong>. The autonomous agent directly handles routine policy lookups, billing calculations, and technical quotas without requiring human intervention, freeing the enterprise support engineering team to focus on mission-critical platform reliability.
            </p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="lg:col-span-5 bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Triage Performance by Domain
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Resolution efficiency across major customer inquiry topics.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {categoryBreakdown.map((cat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#151026] border border-[#291b48] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{cat.name}</span>
                  <span className="font-mono text-purple-300">{cat.automated}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>{cat.count}</span>
                  <span>{cat.percent}% of total volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
