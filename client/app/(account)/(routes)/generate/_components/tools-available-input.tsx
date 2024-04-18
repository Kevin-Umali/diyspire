import { useCallback } from "react";
import { PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ToolsAvailableInputProps {
  tools: string[];
  setTools: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

const ToolsAvailableInput: React.FC<ToolsAvailableInputProps> = ({ tools, setTools, className }) => {
  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newTools = [...tools];
      newTools[index] = value;
      setTools(newTools);
    },
    [tools, setTools],
  );

  const handleDeleteTool = useCallback(
    (index: number) => {
      const newTools = [...tools];
      newTools.splice(index, 1);
      setTools(newTools);
    },
    [tools, setTools],
  );

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">{6}</div>
          <Label className="text-md block font-medium">What tools are available?</Label>
        </div>
        <Label className="text-xs">List down all the tools you have for the DIY project</Label>
      </div>

      <div className="flex w-full flex-col items-center space-y-3">
        {tools.map((tool, index) => (
          <div key={index} className="flex w-full items-center space-x-2">
            <Input className="flex-1 rounded border p-2" value={tool} placeholder="Enter a tool" onChange={(e) => handleInputChange(index, e.target.value)} />
            <Button aria-label="Delete tool" disabled={tools.length === 1} onClick={() => handleDeleteTool(index)}>
              <X />
            </Button>
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={() => setTools([...tools, ""])} aria-label="Add another tool">
        <PlusCircle className="mr-2 size-5" />
        <span>Add another tool</span>
      </Button>
    </div>
  );
};

export default ToolsAvailableInput;
