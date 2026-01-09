// types.ts
export type Domain = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';

export interface FacetScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'Low' | 'Neutral' | 'High';
}

export interface DomainScore {
  domain: string;
  score: number;
  maxScore: number;
  percentage: number;      // raw percentage
  percentile: number;      // ADD THIS
  level: string;           // CHANGE to string (or make it a union of the 5 possible values)
  facets: FacetScore[];
}

export interface Answer {
  questionId: string;
  value: number;
}

export interface Profile {
  id: string;
  name: string;
  role: 'Self' | 'Parent' | 'Child' | 'Partner' | 'Friend' | 'Other';
  scores: DomainScore[];
  timestamp: number;
  isDemo?: boolean;
}

export interface TestResult {
  answers: Answer[];
  scores: DomainScore[];
  timestamp: number;
  personName: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  overview: string;
  frictionPoints: string[];
  groupDynamics?: string; // Insights specifically for 3+ people
  scientificContext: string;
  strategies: string[];
  groundingSources?: GroundingSource[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'O': 'Openness to experience: curiosity, creativity, and willingness to try new things.',
  'C': 'Conscientiousness: tendency to be organized, dependable, and disciplined.',
  'E': 'Extraversion: sociability, assertiveness, and emotional expressiveness.',
  'A': 'Agreeableness: kindness, empathy, and cooperativeness.',
  'N': 'Neuroticism: emotional stability vs. sensitivity to stress and anxiety.'
};