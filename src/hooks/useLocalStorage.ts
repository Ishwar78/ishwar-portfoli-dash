import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// Global in-memory cache to ensure all hooks share the same data
const cache = new Map<string, unknown>();
const subscribers = new Map<string, Set<() => void>>();

function getSnapshot<T>(key: string, initialValue: T): T {
  if (cache.has(key)) {
    return cache.get(key) as T;
  }
  
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    const value = item ? (JSON.parse(item) as T) : initialValue;
    cache.set(key, value);
    return value;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

function subscribe(key: string, callback: () => void): () => void {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key)!.add(callback);
  
  return () => {
    subscribers.get(key)?.delete(callback);
  };
}

function notifySubscribers(key: string): void {
  subscribers.get(key)?.forEach((callback) => callback());
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize cache on first access
  if (!cache.has(key)) {
    getSnapshot(key, initialValue);
  }

  // Use useSyncExternalStore for proper synchronization across components
  const storedValue = useSyncExternalStore(
    (callback) => subscribe(key, callback),
    () => getSnapshot(key, initialValue),
    () => initialValue
  );

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const currentValue = cache.get(key) as T ?? initialValue;
      const newValue = value instanceof Function ? value(currentValue) : value;
      
      // Update cache immediately
      cache.set(key, newValue);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(newValue));
      
      // Notify all subscribers (including this component)
      notifySubscribers(key);
      
      // Dispatch event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(newValue),
        oldValue: JSON.stringify(currentValue),
        storageArea: localStorage,
      }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== localStorage) {
        return;
      }
      
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
        cache.set(key, newValue);
        notifySubscribers(key);
      } catch (error) {
        console.warn(`Error parsing storage event for key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
