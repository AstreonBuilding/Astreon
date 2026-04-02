export interface AgentCapabilities {
  canAnswerProtocolQuestions: boolean
  canAnswerTokenQuestions: boolean
  canDescribeTooling: boolean
  canReportEcosystemNews: boolean
}

export interface AgentFlags {
  requiresExactInvocation: boolean
  noAdditionalCommentary: boolean
}

/**
 * Default capability set for a blockchain-focused agent.
 */
export const DEFAULT_AGENT_CAPABILITIES: AgentCapabilities = {
  canAnswerProtocolQuestions: true,
  canAnswerTokenQuestions: true,
  canDescribeTooling: true,
  canReportEcosystemNews: true,
}

/**
 * Default behavior flags for agent execution.
 */
export const DEFAULT_AGENT_FLAGS: AgentFlags = {
  requiresExactInvocation: true,
  noAdditionalCommentary: true,
}

/**
 * Registry example — makes it easier to extend beyond one agent.
 */
export const AGENT_PROFILES: Record<string, { capabilities: AgentCapabilities; flags: AgentFlags }> = {
  solana: {
    capabilities: { ...DEFAULT_AGENT_CAPABILITIES },
    flags: { ...DEFAULT_AGENT_FLAGS },
  },
}
