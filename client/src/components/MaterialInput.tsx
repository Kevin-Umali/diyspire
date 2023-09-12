import { FC } from "react";
import { Input, VStack, Button, IconButton, InputGroup, InputRightElement, HStack, Text } from "@chakra-ui/react";
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
  };

  const handleDeleteInput = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const handleAddMore = () => {
    setMaterials([...materials, ""]);
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="md">List of materials:</Text>
        <Button width="150px" onClick={handleAddMore}>
          Add More
        </Button>
      </HStack>

      {materials.map((material, index) => (
        <InputGroup key={index}>
          <Input flex="1" placeholder="Type a material" required value={material} onChange={(e) => handleInputChange(index, e.target.value)} />
          <InputRightElement>
            <IconButton aria-label="Delete material" icon={<CloseIcon />} isDisabled={materials.length === 1} onClick={() => handleDeleteInput(index)} size="sm" />
          </InputRightElement>
        </InputGroup>
      ))}
    </VStack>
  );
};

export default MaterialInput;
