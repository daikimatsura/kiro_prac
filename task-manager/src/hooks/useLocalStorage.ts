import { useState, useEffect } from "react";

/**
 * LocalStorageと同期するカスタムフック
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // 初期値を取得（LocalStorageから、または初期値を使用）
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`LocalStorageからの読み込みエラー (key: ${key}):`, error);
      return initialValue;
    }
  });

  // 値を設定し、LocalStorageに保存
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`LocalStorageへの保存エラー (key: ${key}):`, error);
      throw error;
    }
  };

  // 他のタブでの変更を検知
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error("StorageEventの処理エラー:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
