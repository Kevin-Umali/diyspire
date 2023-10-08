import { useCallback, useState } from "react";

const useClipboard = (text: string) => {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setHasCopied(false);
    }
  }, [text]);

  return { hasCopied, onCopy };
};

export default useClipboard;
