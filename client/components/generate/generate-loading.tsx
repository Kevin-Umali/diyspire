import { useState } from "react";
import { loadingMessages } from "@/constants";
import { Info, Loader } from "lucide-react";

import useInterval from "@/hooks/useInterval";
import { Label } from "@/components/ui/label";

const GenerateLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useInterval(() => {
    setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
  }, 5000);

  return (
    <div className="flex min-h-[250px] w-full flex-col items-center justify-center p-4 pt-5 text-center">
      <Loader className="mx-auto size-10 animate-spin" />
      <p className="mt-4 text-lg font-medium" aria-live="polite" aria-atomic="true">
        {loadingMessages[currentMessageIndex]}
      </p>
      <div className="my-4 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <span className="flex items-center justify-center">
          <Info size={24} />
        </span>
        <Label className="text-sm">
          <span role="img" aria-label="info">
            Note: Our system caches suggestions for 2 hours. If you re-enter the same items within this timeframe, you&apos;ll see the same suggestions.
          </span>
        </Label>
      </div>
    </div>
  );
};

export default GenerateLoading;
