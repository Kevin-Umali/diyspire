import { useState } from "react";
import { loadingMessages } from "@/constants";
import useInterval from "@/hooks/useInterval";
import { Loader } from "lucide-react";

const GenerateLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useInterval(() => {
    setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
  }, 5000);

  return (
    <div className="w-full text-center pt-5 p-4 min-h-[150px] flex flex-col items-center justify-center">
      <Loader className="w-10 h-10 animate-spin mx-auto" />
      <p className="mt-4 text-lg font-medium">{loadingMessages[currentMessageIndex]}</p>
    </div>
  );
};

export default GenerateLoading;
