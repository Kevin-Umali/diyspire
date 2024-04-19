import { useCallback } from "react";
import { PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MaterialInputProps {
  materials: string[];
  setMaterials: React.Dispatch<React.SetStateAction<string[]>>;
  onlySpecified: boolean;
  setOnlySpecified: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ materials, setMaterials, onlySpecified, setOnlySpecified, className }) => {
  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const updatedMaterials = [...materials];
      updatedMaterials[index] = value;
      setMaterials(updatedMaterials);
    },
    [materials, setMaterials],
  );

  const handleDeleteInput = useCallback(
    (index: number) => {
      const updatedMaterials = [...materials];
      updatedMaterials.splice(index, 1);
      setMaterials(updatedMaterials);
    },
    [materials, setMaterials],
  );

  const handleAddMore = useCallback(() => {
    setMaterials([...materials, ""]);
  }, [materials, setMaterials]);

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">3</div>
          <Label className="text-md block font-medium">Do you have materials in hand or what materials do you want to use?</Label>
        </div>
        <Label className="text-xs">Leave it empty to use random materials</Label>
      </div>
      {materials.map((material, index) => (
        <div key={index} className="flex items-center justify-center space-x-2">
          <Input className="flex-1 border p-2" placeholder="Type a material" required value={material} onChange={(e) => handleInputChange(index, e.target.value)} />
          <Button aria-label="Delete material" onClick={() => handleDeleteInput(index)} disabled={materials.length === 1}>
            <X />
          </Button>
        </div>
      ))}
      {materials.some((mat) => mat.trim() !== "") && (
        <div className="inline-flex cursor-pointer items-center justify-center space-x-2">
          <Checkbox id="onlySpecifiedMaterials" checked={onlySpecified} onCheckedChange={() => setOnlySpecified(!onlySpecified)} />
          <Label htmlFor="onlySpecifiedMaterials">Use only these materials</Label>
        </div>
      )}
      <Button className="mt-4 w-full focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={handleAddMore} aria-label="Add more materials">
        <PlusCircle className="mr-2 size-5" />
        <span>Add More</span>
      </Button>
    </div>
  );
};

export default MaterialInput;
