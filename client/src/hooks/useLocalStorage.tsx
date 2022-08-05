import { useState } from "react";
import { LocalStorage } from "../services/Storage";

export default function useLocalStorage(key: string, defaultValue: any): any[] {
  const localStorage = new LocalStorage();
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.get(key);
      return item ?? defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.add(key, valueToStore);
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
