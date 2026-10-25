/**
 * Exultia Autonomous AI Support Engine with RAG Context Architecture
 * 
 * Provides 24/7 autonomous technical intelligence, licensing calculations,
 * installation commands, deterministic rollback instructions, and product guidance.
 * Grounded directly in site specifications, architecture wikis, FAQs, and the Bullshit Validator.
 */

import { RagKnowledgeBase, type RagChunk } from './rag-knowledge-base';

export interface SupportChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface SupportResponse {
  reply: string;
  suggestions: string[];
  topic: string;
  sources?: { title: string; doc: string; url: string }[];
  timestamp: string;
}

export class AiSupportEngine {
  /**
   * Process an inquiry using RAG retrieval against site specifications, FAQs, and codebases.
   */
  public static processQuery(
    query: string,
    history: SupportChatMessage[] = [],
    productContext?: string
  ): SupportResponse {
    const q = query.trim();
    const now = new Date().toISOString();

    // 1. Check for dynamic host pricing calculation (e.g. "cost for 25 hosts")
    const dynamicCostText = RagKnowledgeBase.calculateHostCost(q);

    // 2. Perform RAG semantic & lexical retrieval across corpus
    const retrieved = RagKnowledgeBase.retrieve(q, productContext, 2);

    if (retrieved.length > 0 && retrieved[0].score >= 25) {
      const primary = retrieved[0].chunk;
      const secondary = retrieved.length > 1 && retrieved[1].score >= 40 ? retrieved[1].chunk : null;

      let replyContent = primary.content;

      // Append dynamic calculation if user asked about fleet counts
      if (dynamicCostText && !replyContent.includes('Dynamic Fleet Estimate')) {
        replyContent += dynamicCostText;
      }

      // If a secondary chunk is highly relevant, append summary highlight
      if (secondary && secondary.id !== primary.id) {
        replyContent += `\n\n---\n#### 💡 Related Specification: [${secondary.title}](${secondary.sourceUrl})\n${secondary.content.split('\n\n')[1] || secondary.content.slice(0, 200) + '...'}`;
      }

      // Append authoritative provenance citation
      replyContent += `\n\n> 📖 *Source Specification: [${primary.sourceDoc}](${primary.sourceUrl})*`;

      const allSuggestions = Array.from(
        new Set([...primary.suggestions, ...(secondary ? secondary.suggestions : [])])
      ).slice(0, 4);

      return {
        reply: replyContent,
        suggestions: allSuggestions,
        topic: primary.topic,
        sources: [
          { title: primary.title, doc: primary.sourceDoc, url: primary.sourceUrl },
          ...(secondary ? [{ title: secondary.title, doc: secondary.sourceDoc, url: secondary.sourceUrl }] : [])
        ],
        timestamp: now
      };
    }

    // 3. Fallback: If no single chunk met the high-confidence threshold, synthesize a structured Sovereign response
    return {
      topic: 'general',
      timestamp: now,
      reply: `### 🤖 Exultia Technical AI Support Sentinel

Welcome! I am Exultia's **24/7 technical AI support sentinel**, maintained under our lean **solo-operator** engineering model. Grounded directly in our architectural wikis, CVE sentinels, and the [**Bullshit Validator verification fleet**](https://github.com/exultia-tech/demo).

#### Key Technical Foundations:
- **Zero Vaporware Guarantee:** Run \`git clone --depth=1 https://github.com/exultia-tech/demo.git && cd demo && python3 validate.py\` to test our sub-second rollback engine and SLSA Level 3 checksums locally in ~5 seconds.
- **Unified Cyber Sovereignty Platform ($100/mo):** Unlocks all 7 defense engines (Vantage, Praxis, Eris, Valkyrie, PureIDE, PureOS, Axiom) with zero fragmented add-ons.
- **Deterministic Sub-Second Rollback:** \`sudo kinetic rollback --cve=...\` restores pre-image SHA-256 state in 14ms (<100ms SLA) with zero host reboot.
- **Unidirectional Zero Telemetry:** Strict outbound silence with zero cloud exfiltration; full offline support for air-gapped SCIF environments.
- **Sales Demo Policy:** *"Find the most technical person you know, send them a link to our repo, and tell them to follow the instructions."*

What specific technical subsystem, CVE mitigation, or architectural topic can I help you explore?`,
      suggestions: [
        'Can I get a sales demo?',
        'How do I run the Bullshit Validator?',
        'Is in-memory hotpatching safe?',
        'What is included in the $100/mo platform plan?'
      ],
      sources: [
        { title: 'The Bullshit Validator', doc: 'https://github.com/exultia-tech/demo', url: 'https://github.com/exultia-tech/demo' },
        { title: 'Interactive Wiki & Architecture', doc: 'wiki/architecture.md', url: '/wiki' },
        { title: 'FAQ & Skepticism Directory', doc: 'src/app/faq/page.tsx', url: '/faq' }
      ]
    };
  }
}
