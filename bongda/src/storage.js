const MATCHES_KEY = 'ltw_bongda_matches';
export const loadSaved = () => {
  try {
    const value = localStorage.getItem(MATCHES_KEY);
    if (value === null) return null;
    const matches = JSON.parse(value);
    return Array.isArray(matches) ? matches : null;
  } catch { return null; }
};
export const saveMatches = (matches) => {
  try { localStorage.setItem(MATCHES_KEY, JSON.stringify(matches)); } catch { /* Storage may be disabled or full. */ }
};
