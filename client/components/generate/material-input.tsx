import { useCallback } from "react";
import { PlusCircle, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="space-y-1 text-left">
          <Label className="block text-md font-medium">List of materials:</Label>
          <Label className="text-xs">Leave it as empty to use random materials</Label>
        </div>
        <Button className="focus:outline-none focus:ring-20 focus:ring-opacity-50s space-x-2" onClick={handleAddMore} aria-label="Add more materials">
          <PlusCircle className="w-5 h-5" />
          <span>Add More</span>
        </Button>
      </div>
      {materials.map((material, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input className="flex-1 p-2 rounded border" placeholder="Type a material" required value={material} onChange={(e) => handleInputChange(index, e.target.value)} />
          <Button aria-label="Delete material" onClick={() => handleDeleteInput(index)} disabled={materials.length === 1}>
            <X />
          </Button>
        </div>
      ))}
      {materials.some((mat) => mat.trim() !== "") && (
        <div className="inline-flex items-center space-x-2 cursor-pointer">
          <Checkbox id="onlySpecifiedMaterials" />
          <Label htmlFor="onlySpecifiedMaterials" onClick={() => setOnlySpecified(!onlySpecified)}>
            Use only these materials
          </Label>
        </div>
      )}
    </div>
  );
};

export default MaterialInput;
