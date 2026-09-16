import { INITIAL_CHUNKS } from '../data/knowledgeBase';
import { SimilarityResult, VectorChunk } from '../types';

export class PineconeIndexSimulator {
  private chunks: VectorChunk[];
  private indexName = 'enterprise-support-v3';
  private dimension = 1536;
  private metric = 'cosine';

  constructor(initialChunks: VectorChunk[] = INITIAL_CHUNKS) {
    this.chunks = [...initialChunks];
  }

  public getIndexStats() {
    return {
      indexName: this.indexName,
      dimension: this.dimension,
      metric: this.metric,
      totalVectors: this.chunks.length + 42840, // realistic enterprise count
      namespaces: {
        'kb-production': this.chunks.length,
        'kb-staging': 1420,
        'kb-archived': 3820
      },
      status: 'Ready',
      cloud: 'aws',
      region: 'us-east-1'
    };
  }

  public getAllChunks(): VectorChunk[] {
    return [...this.chunks];
  }

  public addChunk(chunk: Omit<VectorChunk, 'id' | 'embeddingPreview'>): VectorChunk {
    const id = `vec-custom-${Date.now()}`;
    const embeddingPreview = Array.from({ length: 8 }, () => Number((Math.random() * 0.2 - 0.1).toFixed(4)));
    const newChunk: VectorChunk = {
      ...chunk,
      id,
      embeddingPreview
    };
    this.chunks.unshift(newChunk);
    return newChunk;
  }

  /**
   * Performs semantic similarity search simulating Pinecone's cosine metric.
   */
  public query(queryText: string, topK = 3, categoryFilter?: string): SimilarityResult[] {
    const queryTokens = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    const scoredChunks = this.chunks
      .filter(chunk => !categoryFilter || chunk.category === categoryFilter)
      .map(chunk => {
        const chunkTextLower = (chunk.text + ' ' + chunk.docTitle + ' ' + chunk.metadata.tags.join(' ')).toLowerCase();
        
        // Match keywords
        const matched = queryTokens.filter(token => token.length > 2 && chunkTextLower.includes(token));
        
        // Base semantic simulation score
        let score = 0.52; // baseline semantic relevance floor
        
        // Term frequency boost
        if (matched.length > 0) {
          const matchRatio = matched.length / Math.max(1, queryTokens.length);
          score += matchRatio * 0.42;
        }

        // Domain keyword specific semantic affinity
        const domainAffinityMap: Record<string, string[]> = {
          'refund': ['cancel', 'money-back', 'pro-rata', 'fee', 'deduction', '$4,800', 'guarantee'],
          'sla': ['critical', 'outage', 'response', 'platinum', 'gold', 'p0', 'p1', 'down', 'sre', '500'],
          'security': ['soc2', 'hipaa', 'card', 'cvv', 'password', 'privacy', 'gdpr', 'pii', 'compliance'],
          'rate': ['429', 'rate', 'rpm', 'burst', 'backoff', 'quota', 'limit', 'jitter'],
          'sso': ['saml', 'scim', 'okta', 'azure', 'login', 'directory', 'portal']
        };

        for (const [key, terms] of Object.entries(domainAffinityMap)) {
          const hasQueryTerm = queryTokens.some(q => terms.includes(q) || terms.some(t => q.includes(t)));
          const hasChunkTag = chunk.metadata.tags.some(tag => tag.includes(key));
          if (hasQueryTerm && hasChunkTag) {
            score += 0.22;
          }
        }

        // Clamp between 0.35 and 0.985
        score = Math.min(0.985, Math.max(0.35, score + (Math.sin(chunk.id.length) * 0.03)));
        score = Number(score.toFixed(4));

        return {
          chunk,
          score,
          matchedKeywords: matched
        };
      });

    // Sort by score descending
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, topK);
  }
}

export const pineconeSimulator = new PineconeIndexSimulator();
