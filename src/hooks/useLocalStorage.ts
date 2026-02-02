import { useState, useEffect, useCallback } from 'react';

// Event name for cross-component sync within same tab
const SYNC_EVENT = 'portfolio-storage-sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Read from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Get current value from localStorage to ensure we have latest
      const currentStored = readValue();
      const newValue = value instanceof Function ? value(currentStored) : value;
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(newValue));
      
      // Update local state
      setStoredValue(newValue);
      
      // Dispatch custom event for same-tab sync
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { 
        detail: { key, value: newValue } 
      }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, readValue]);

  // Sync on mount and when key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  // Listen for changes from other components in same tab
  useEffect(() => {
    const handleSync = (event: CustomEvent<{ key: string; value: T }>) => {
      if (event.detail.key === key) {
        setStoredValue(event.detail.value);
      }
    };

    // Listen for storage changes from other tabs
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === localStorage) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
