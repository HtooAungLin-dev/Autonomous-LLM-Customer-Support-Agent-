import React, { useState } from 'react';
import { Database, Search, Plus, Filter, Tag, Layers, CheckCircle2, Clock, FileText, Cpu, ArrowUpRight } from 'lucide-react';
import { pineconeSimulator } from '../utils/vectorStore';
import { VectorChunk } from '../types';

export const VectorStoreExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allChunks, setAllChunks] = useState<VectorChunk[]>(() => pineconeSimulator.getAllChunks());
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('billing');
  const [newText, setNewText] = useState('');
  const [newTags, setNewTags] = useState('');

  const stats = pineconeSimulator.getIndexStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const filter = selectedCategory === 'all' ? undefined : selectedCategory;
    const results = pineconeSimulator.query(searchQuery, 4, filter);
    setSearchResults(results);
  };

  const handleAddChunk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const added = pineconeSimulator.addChunk({
      docId: `doc-${Date.now()}`,
      docTitle: newTitle.trim(),
      category: newCategory,
      text: newText.trim(),
      metadata: {
        section: 'Custom Knowledge Insertion',
        authorityLevel: 'Enterprise Policy',
        tokenCount: Math.floor(newText.length / 4),
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
      }
    });

    setAllChunks(pineconeSimulator.getAllChunks());
    setIsAddingDoc(false);
    setNewTitle('');
    setNewText('');
    setNewTags('');
  };

  return (
    <div id="pinecone-explorer-container" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Pinecone Cluster & Index Banner */}
      <div className="bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#231742] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Pinecone Vector Index: enterprise-support-v3</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Ready (Status 200)
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Managed Serverless Vector DB • Cloud: <span className="text-purple-300">AWS (us-east-1)</span> • Similarity Metric: <span className="text-purple-300">Cosine</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingDoc(!isAddingDoc)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-md shadow-purple-950 transition-all"
          >
            <Plus className="w-4 h-4" />
            Index New Document Chunk
          </button>
        </div>

        {/* Index Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-[#17112c] border border-[#2e1c50]">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Total Vectors</div>
            <div className="text-xl font-extrabold text-white mt-1">
              {(stats.totalVectors).toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Across 3 namespaces</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17112c] border border-[#2e1c50]">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Vector Dimension</div>
            <div className="text-xl font-extrabold text-white mt-1">1,536</div>
            <div className="text-[11px] text-gray-400 mt-0.5">OpenAI / Gemini Embeddings</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17112c] border border-[#2e1c50]">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Active Namespace</div>
            <div className="text-xl font-extrabold text-white mt-1 font-mono">kb-production</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{allChunks.length} customer policy chunks</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#17112c] border border-[#2e1c50]">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Avg Retrieval Latency</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">14.2 ms</div>
            <div className="text-[11px] text-gray-400 mt-0.5">p95 &lt; 28ms</div>
          </div>
        </div>
      </div>

      {/* Add Document Chunk Modal / Accordion */}
      {isAddingDoc && (
        <form onSubmit={handleAddChunk} className="bg-[#140f26] rounded-2xl border border-purple-700/60 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Insert New Vector Chunk into Pinecone
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingDoc(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-purple-300 font-medium block mb-1">Document Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Enterprise Backup & Disaster Recovery RPO"
                required
                className="w-full bg-[#1e1638] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#40286e] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-purple-300 font-medium block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#1e1638] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#40286e] focus:outline-none focus:border-purple-500"
              >
                <option value="billing">Billing & Financial</option>
                <option value="sla">SLA & Commitments</option>
                <option value="security">Security & Compliance</option>
                <option value="technical">Technical & Architecture</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-purple-300 font-medium block mb-1">Chunk Text / Policy Content</label>
            <textarea
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter the factual statement to be vectorized and indexed for retrieval..."
              required
              className="w-full bg-[#1e1638] text-white text-xs rounded-xl p-3.5 border border-[#40286e] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-purple-300 font-medium block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="e.g. backup, disaster-recovery, rpo, enterprise"
              className="w-full bg-[#1e1638] text-white text-xs rounded-xl px-3.5 py-2.5 border border-[#40286e] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Generate 1536-dim Embedding & Upsert Chunk
            </button>
          </div>
        </form>
      )}

      {/* Semantic Vector Search Playground */}
      <div className="bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" /> Real-time Pinecone Semantic Similarity Search
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Simulates vector query execution against the 1,536-dimensional embedding space.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1a1233] text-purple-200 text-xs rounded-lg border border-[#3b2469] px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="billing">Billing & Refund</option>
              <option value="sla">SLA & Response</option>
              <option value="security">Security & Privacy</option>
              <option value="technical">Technical & API</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try searching: '30 day refund guarantee', 'Platinum outage 15 min', 'HTTP 429 burst RPM'..."
            className="flex-1 bg-[#191230] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-[#392464] focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950"
          >
            <Search className="w-4 h-4" /> Query Pinecone
          </button>
        </form>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="pt-2 space-y-3">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Top Ranked Candidates ({searchResults.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((res, i) => (
                <div
                  key={res.chunk.id}
                  className="p-4 rounded-xl bg-[#17112c] border border-purple-800/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">#{i + 1} {res.chunk.docTitle}</span>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold">
                      Cosine: {(res.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-400 font-medium">
                    {res.chunk.metadata.section}
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xs">
                    "{res.chunk.text}"
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400 font-mono">
                    <span>Embeddings: [{res.chunk.embeddingPreview.slice(0, 4).join(', ')} ... 1536 dims]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Indexed Knowledge Base Repository */}
      <div className="bg-[#100e1b] rounded-2xl border border-[#2b1d4e] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Vectorized Document Chunks in Index ({allChunks.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Enterprise customer operations corpus indexed with metadata for hybrid keyword-dense vector filtering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allChunks.map((chunk) => (
            <div
              key={chunk.id}
              className="p-4 rounded-xl bg-[#140f24] border border-[#2b1b4b] hover:border-purple-700/60 transition-colors text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-white">{chunk.docTitle}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#261745] text-purple-300 border border-[#422675]">
                  {chunk.category}
                </span>
              </div>

              <div className="text-[11px] text-purple-300 font-medium">
                {chunk.metadata.section} • Authority: <span className="text-gray-300">{chunk.metadata.authorityLevel}</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-xs">
                {chunk.text}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#23173d]">
                <Tag className="w-3 h-3 text-gray-400" />
                {chunk.metadata.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#1e1538] text-[10px] text-purple-300 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
