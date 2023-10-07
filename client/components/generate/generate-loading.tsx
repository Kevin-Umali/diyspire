import { useState } from "react";
import { loadingMessages } from "@/constants";
import useInterval from "@/hooks/useInterval";
import { Info, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";

const GenerateLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useInterval(() => {
    setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
  }, 5000);

  return (
    <div className="w-full text-center pt-5 p-4 min-h-[150px] flex flex-col items-center justify-center">
      <Loader className="w-10 h-10 animate-spin mx-auto" />
      <p className="mt-4 text-lg font-medium" aria-live="polite" aria-atomic="true">
        {loadingMessages[currentMessageIndex]}
      </p>
      <div className="mb-4 mt-4 flex items-center">
        <span className="mr-2 flex items-center">
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
