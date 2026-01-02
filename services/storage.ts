
import { Profile } from "../types.ts";

const STORAGE_KEY = "pdl_profiles";

export const saveProfile = (profile: Profile): void => {
  const existing = getProfiles();
  // Update if exists, otherwise add
  const filtered = existing.filter(p => p.id !== profile.id);
  const updated = [...filtered, profile];
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

// Sharing Logic: Encode profile to Base64 String
export const encodeProfile = (profile: Profile): string => {
  try {
    const json = JSON.stringify(profile);
    return btoa(json); // Simple Base64 encoding
  } catch (e) {
    console.error("Failed to encode profile", e);
    return "";
  }
};

// Sharing Logic: Decode profile from Base64 String
export const decodeAndSaveProfile = (encoded: string): Profile | null => {
  try {
    const json = atob(encoded);
    const profile: Profile = JSON.parse(json);
    
    // Validate structure roughly
    if (!profile.id || !profile.scores || !profile.name) {
        throw new Error("Invalid profile structure");
    }
    
    // Force a new ID to avoid collisions if re-importing, or keep orig? 
    // Let's keep original ID to allow "updates" if they send a new one, 
    // but usually sharing implies a snapshot.
    // Let's overwrite ID to ensure it's treated as a new entry in MY library if I import it.
    profile.id = generateId(); 
    
    saveProfile(profile);
    return profile;
  } catch (e) {
    console.error("Failed to decode profile", e);
    return null;
  }
};
