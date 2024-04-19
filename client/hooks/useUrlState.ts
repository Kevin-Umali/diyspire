import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const useURLState = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialState = (): T => {
    const value = decodeURIComponent(searchParams.get(key) || "");
    if (value !== null) {
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.info(`Missing or Error parsing URL parameter "${key}"`);
      }
    }
    return defaultValue;
  };

  const [state, setState] = useState<T>(getInitialState);

  const updateURL = useCallback(
    (newValue: T) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, encodeURIComponent(JSON.stringify(newValue)));
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [key, router, searchParams],
  );

  useEffect(() => {
    updateURL(state);
  }, [state, updateURL]);

  return [state, setState];
};

export default useURLState;
