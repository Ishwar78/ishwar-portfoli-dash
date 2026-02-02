import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Use a ref to always have access to the latest value without causing re-renders
  const storedValueRef = useRef<T>(initialValue);
  
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      const parsedValue = item ? (JSON.parse(item) as T) : initialValue;
      storedValueRef.current = parsedValue;
      return parsedValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Keep ref in sync with state
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Use ref to get the latest value to avoid stale closures
      const currentValue = storedValueRef.current;
      const newValue = value instanceof Function ? value(currentValue) : value;
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(newValue));
      
      // Update ref immediately
      storedValueRef.current = newValue;
      
      // Update state
      setStoredValue(newValue);
      
      // Dispatch event for cross-component sync
      window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const value = readValue();
    setStoredValue(value);
  }, []);

  // Listen for storage changes (from other tabs or components)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      // For CustomEvent (same tab), check if it's for this key
      if (event instanceof CustomEvent && event.detail?.key !== key) {
        return;
      }
      
      // For StorageEvent (other tabs), check the key
      if (event instanceof StorageEvent && event.key !== key) {
        return;
      }
      
      const value = readValue();
      setStoredValue(value);
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
