export type Domain = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';

export interface DomainScore {
  domain: Domain;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'Low' | 'Neutral' | 'High';
}

export interface Answer {
  questionId: string;
  value: number;
}

export interface TestResult {
  answers: Answer[];
  scores: DomainScore[];
  timestamp: number;
  personName: string;
}

export interface AnalysisResult {
  overview: string;
  frictionPoints: string[];
  scientificContext: string;
  strategies: string[];
}

export const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  'O': 'Openness to experience: curiosity, creativity, and willingness to try new things.',
  'C': 'Conscientiousness: tendency to be organized, dependable, and disciplined.',
  'E': 'Extraversion: sociability, assertiveness, and emotional expressiveness.',
  'A': 'Agreeableness: kindness, empathy, and cooperativeness.',
  'N': 'Neuroticism: emotional stability vs. sensitivity to stress and anxiety.'
};