import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

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
    [tools, setTools]
  );

  const handleDeleteTool = useCallback(
    (index: number) => {
      const newTools = [...tools];
      newTools.splice(index, 1);
      setTools(newTools);
    },
    [tools, setTools]
  );

  return (
    <div className={`mb-4 ${className}`}>
      <Label className="block text-md font-medium mb-2">Available Tools:</Label>
      <div className="space-y-3">
        {tools.map((tool, index) => (
          <div key={tool || index} className="flex items-center space-x-2">
            <Input className="flex-1" value={tool} placeholder="Enter a tool" onChange={(e) => handleInputChange(index, e.target.value)} />
            <Button aria-label="Delete tool" disabled={tools.length === 1} onClick={() => handleDeleteTool(index)}>
              <X />
            </Button>
          </div>
        ))}
        <Button className="w-full lg:w-auto focus:outline-none focus:ring-20 focus:ring-opacity-50 space-x-2" onClick={() => setTools([...tools, ""])} aria-label="Add another tool">
          <PlusCircle className="w-5 h-5" />
          <span>Add another tool</span>
        </Button>
      </div>
    </div>
  );
};

export default ToolsAvailableInput;
