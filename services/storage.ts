
// storage.ts
import { Profile, Answer } from "../types.ts";
import { getSession } from "./authService.ts";

const PROGRESS_KEY = "pdl_test_progress";

// Helper to get user-specific storage key
const getVaultKey = (base: string) => {
  const session = getSession();
  if (!session) return `guest_${base}`;
  return `${session.vaultKey}_${base}`;
};

const STORAGE_KEY = "profiles";

export const saveProfile = (profile: Profile): void => {
  const key = getVaultKey(STORAGE_KEY);
  const existing = getRawProfiles(key);
  const filtered = existing.filter(p => p.id !== profile.id);
  const updated = [...filtered, profile];
  localStorage.setItem(key, JSON.stringify(updated));
};

const getRawProfiles = (key: string): Profile[] => {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse profiles", e);
    }
  }
  return [];
};

export const getProfiles = (includeDemos = true): Profile[] => {
  const key = getVaultKey(STORAGE_KEY);
  const saved = getRawProfiles(key);
  
  if (includeDemos && saved.length === 0) {
    return DEMO_PROFILES;
  }
  return saved;
};

export const getProfileById = (id: string): Profile | null => {
  const all = getProfiles();
  return all.find(p => p.id === id) || null;
};

export const deleteProfile = (id: string): void => {
  const key = getVaultKey(STORAGE_KEY);
  const existing = getRawProfiles(key);
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveTestProgress = (idx: number, answers: Answer[]): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ idx, answers }));
};

export const getTestProgress = (): { idx: number, answers: Answer[] } | null => {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearTestProgress = (): void => {
  localStorage.removeItem(PROGRESS_KEY);
};

export const encodeProfile = (profile: Profile): string => {
  try {
    const json = JSON.stringify(profile);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
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
  } catch {
    return null;
  }
};

// Functions for Lab management in ResultsPage
/**
 * Triggers a browser download of the current profile library as a JSON file.
 */
export const exportLibrary = (): void => {
  const key = getVaultKey(STORAGE_KEY);
  const data = localStorage.getItem(key);
  if (!data) {
    alert("Nothing to export.");
    return;
  }
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pdl_library_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Parses a JSON string and overwrites the current library in storage.
 * @param json The JSON string content to import.
 * @returns boolean indicating success of the operation.
 */
export const importLibrary = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return false;
    const key = getVaultKey(STORAGE_KEY);
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Import failed:", error);
    return false;
  }
};

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
