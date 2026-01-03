// storage.ts
import { Profile, Answer } from "../types.ts";

const STORAGE_KEY = "pdl_profiles";
const PROGRESS_KEY = "pdl_test_progress";

const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Alex (The Architect)",
    role: "Other",
    isDemo: true,
    timestamp: 1700000000000,
    scores: [
      { domain: "Openness", score: 28, maxScore: 30, percentage: 93, level: "High", facets: [] },
      { domain: "Conscientiousness", score: 27, maxScore: 30, percentage: 90, level: "High", facets: [] },
      { domain: "Extraversion", score: 12, maxScore: 30, percentage: 40, level: "Neutral", facets: [] },
      { domain: "Agreeableness", score: 15, maxScore: 30, percentage: 50, level: "Neutral", facets: [] },
      { domain: "Neuroticism", score: 10, maxScore: 30, percentage: 33, level: "Low", facets: [] }
    ]
  },
  {
    id: "demo-2",
    name: "Jordan (The Free Spirit)",
    role: "Other",
    isDemo: true,
    timestamp: 1700000000001,
    scores: [
      { domain: "Openness", score: 29, maxScore: 30, percentage: 96, level: "High", facets: [] },
      { domain: "Conscientiousness", score: 8, maxScore: 30, percentage: 26, level: "Low", facets: [] },
      { domain: "Extraversion", score: 26, maxScore: 30, percentage: 86, level: "High", facets: [] },
      { domain: "Agreeableness", score: 24, maxScore: 30, percentage: 80, level: "High", facets: [] },
      { domain: "Neuroticism", score: 18, maxScore: 30, percentage: 60, level: "Neutral", facets: [] }
    ]
  }
];

export const saveProfile = (profile: Profile): void => {
  const existing = getProfiles(false);
  const filtered = existing.filter(p => p.id !== profile.id);
  const updated = [...filtered, profile];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getProfiles = (includeDemos = true): Profile[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  let saved: Profile[] = [];
  if (raw) {
    try {
      saved = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse profiles", e);
    }
  }
  return includeDemos ? [...DEMO_PROFILES, ...saved] : saved;
};

export const deleteProfile = (id: string): void => {
  const existing = getProfiles(false);
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Test Progress Persistence
export const saveTestProgress = (idx: number, answers: Answer[]): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ idx, answers }));
};

export const getTestProgress = (): { idx: number, answers: Answer[] } | null => {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const clearTestProgress = (): void => {
  localStorage.removeItem(PROGRESS_KEY);
};

// Library Export/Import
export const exportLibrary = () => {
  const data = getProfiles(false);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pdl_library_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

export const importLibrary = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const encodeProfile = (profile: Profile): string => {
  try {
    const json = JSON.stringify(profile);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    return "";
  }
};

export const decodeAndSaveProfile = (encoded: string): Profile | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const profile: Profile = JSON.parse(json);
    profile.id = generateId(); 
    saveProfile(profile);
    return profile;
  } catch (e) {
    return null;
  }
};