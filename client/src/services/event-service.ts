import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock'
import type { Concert } from '../types/concert'

export function getRecommendedEvents(): Concert[] {
  return INITIAL_MOCK_CONCERTS
}

