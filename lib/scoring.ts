import { Answer, DomainScore, Domain } from "../types.ts";

export interface Question {
  id: string;
  text: string;
  domain: 'O' | 'C' | 'E' | 'A' | 'N';
  keyed: 'plus' | 'minus';
}

const questions: Question[] = [
  { "id": "1", "text": "Am the life of the party.", "domain": "E", "keyed": "plus" },
  { "id": "2", "text": "Feel little concern for others.", "domain": "A", "keyed": "minus" },
  { "id": "3", "text": "Am always prepared.", "domain": "C", "keyed": "plus" },
  { "id": "4", "text": "Get stressed out easily.", "domain": "N", "keyed": "plus" },
  { "id": "5", "text": "Have a rich vocabulary.", "domain": "O", "keyed": "plus" },
  { "id": "6", "text": "Don't talk a lot.", "domain": "E", "keyed": "minus" },
  { "id": "7", "text": "Am interested in people.", "domain": "A", "keyed": "plus" },
  { "id": "8", "text": "Leave my belongings around.", "domain": "C", "keyed": "minus" },
  { "id": "9", "text": "Am relaxed most of the time.", "domain": "N", "keyed": "minus" },
  { "id": "10", "text": "Have difficulty understanding abstract ideas.", "domain": "O", "keyed": "minus" }
];

export const getQuestions = () => questions;

export const calculateScores = (answers: Answer[]): DomainScore[] => {
  const domainMap: Record<string, Domain> = {
    'O': 'Openness',
    'C': 'Conscientiousness',
    'E': 'Extraversion',
    'A': 'Agreeableness',
    'N': 'Neuroticism'
  };

  const domainScores: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const domainCounts: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  answers.forEach(answer => {
    const q = questions.find(q => q.id === answer.questionId);
    if (!q) return;
    let val = answer.value;
    if (q.keyed === 'minus') val = 6 - answer.value;
    domainScores[q.domain] += val;
    domainCounts[q.domain]++;
  });

  return Object.keys(domainMap).map(key => {
    const raw = domainScores[key];
    const max = domainCounts[key] * 5;
    const percentage = Math.round((raw / max) * 100);
    let level: 'Low' | 'Neutral' | 'High' = 'Neutral';
    if (percentage < 40) level = 'Low';
    else if (percentage > 60) level = 'High';
    return { domain: domainMap[key], score: raw, maxScore: max, percentage, level };
  });
};