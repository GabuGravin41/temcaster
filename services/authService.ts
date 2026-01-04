// authService.ts
const SESSION_KEY = "pdl_session";

export interface UserSession {
  email: string;
  name: string;
  vaultKey: string; // Hash of email to partition storage
}

export const getSession = (): UserSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

export const login = async (email: string, name: string): Promise<void> => {
  const vaultKey = await hashString(email.toLowerCase().trim());
  const session: UserSession = { email, name, vaultKey };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  return !!getSession();
};