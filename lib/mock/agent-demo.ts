import { MOCK_AGENT_RESPONSES } from '@/data/mock/mock'

// ── Demo Mock Responses 
// Hardcoded responses for the hackathon demo.
// These replace live API calls so the demo works without any API key.




// ── Query matcher 
// Maps free-text input to a mock response key
export function matchDemoQuery(
  message: string
): keyof typeof MOCK_AGENT_RESPONSES | null {
  const lower = message.toLowerCase()

  if (lower.includes('adaeze') && (lower.includes('deliver') || lower.includes('ready') || lower.includes('when'))) {
    return 'adaeze_delivery'
  }
  if (lower.includes('chiamaka') || lower.includes('shortage') || lower.includes('blocked') || lower.includes('fabric')) {
    return 'chiamaka_shortage'
  }
  if (lower.includes('assign') || lower.includes('tailor') || lower.includes('miriam') || lower.includes('workforce')) {
    return 'tailor_assignment'
  }

  return null
}