/**
 * Canonical IDs for all knowledge agents.
 * Keep IDs stable for consistency across the system.
 */
export enum KnowledgeAgentId {
  Solana = "solana-knowledge-agent",
  // future agents can be added here, e.g.:
  // Ethereum = "ethereum-knowledge-agent",
  // Cosmos = "cosmos-knowledge-agent",
}

export const SOLANA_KNOWLEDGE_AGENT_ID: KnowledgeAgentId = KnowledgeAgentId.Solana
