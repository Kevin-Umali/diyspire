// src/components/MaterialInput.tsx

import { FC } from "react";
import { Input, VStack, Button, IconButton, InputGroup, InputRightElement } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface MaterialInputProps {
  materials: string[];
  setMaterials: React.Dispatch<React.SetStateAction<string[]>>;
}

const MaterialInput: FC<MaterialInputProps> = ({ materials, setMaterials }) => {
  const handleInputChange = (index: number, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = value;
    setMaterials(updatedMaterials);

    // Check if the current input being edited is the last one and it's not empty
    // if (index === materials.length - 1 && value.trim() !== "") {
    //   setMaterials([...updatedMaterials, ""]); // Append an empty input
    // }
  };

  const handleDeleteInput = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const handleAddMore = () => {
    setMaterials([...materials, ""]); // Append an empty input
  };

  return (
    <VStack spacing={4}>
      {materials.map((material, index) => (
        <InputGroup key={index} width="100%">
          <Input flex="1" placeholder="Type a material" required value={material} onChange={(e) => handleInputChange(index, e.target.value)} />
          <InputRightElement>
            <IconButton aria-label="Delete material" icon={<CloseIcon />} isDisabled={materials.length === 1} onClick={() => handleDeleteInput(index)} size="sm" />
          </InputRightElement>
        </InputGroup>
      ))}
      <Button onClick={handleAddMore}>Add More</Button>
    </VStack>
  );
};

export default MaterialInput;
