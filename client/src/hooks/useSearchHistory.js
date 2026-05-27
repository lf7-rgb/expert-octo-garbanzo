import { useState } from 'react';

const STORAGE_KEY = 'weather_search_history';
const MAX_HISTORY = 5;

/**
 * Persists the last MAX_HISTORY city searches in localStorage.
 * Returns [history, addToHistory].
 */
export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  function addToHistory(city) {
    setHistory((prev) => {
      // Remove duplicates (case-insensitive), prepend new entry, cap at max
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
      );
      const next = [city, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return [history, addToHistory];
}
