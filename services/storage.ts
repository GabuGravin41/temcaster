
import { Profile } from "../types.ts";

const STORAGE_KEY = "pdl_profiles";

export const saveProfile = (profile: Profile): void => {
  const existing = getProfiles();
  const updated = [...existing.filter(p => p.id !== profile.id), profile];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getProfiles = (): Profile[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse profiles", e);
    return [];
  }
};

export const getProfile = (id: string): Profile | undefined => {
  return getProfiles().find(p => p.id === id);
};

export const deleteProfile = (id: string): void => {
  const existing = getProfiles();
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Helper to generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
