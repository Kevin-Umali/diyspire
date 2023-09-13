import { FC } from "react";
import { Input, VStack, Button, IconButton, InputGroup, InputRightElement, HStack, Text, Checkbox } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface MaterialInputProps {
  materials: string[];
  setMaterials: React.Dispatch<React.SetStateAction<string[]>>;
  onlySpecified: boolean;
  setOnlySpecified: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaterialInput: FC<MaterialInputProps> = ({ materials, setMaterials, onlySpecified, setOnlySpecified }) => {
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
        <VStack align="start" spacing={1}>
          <Text fontSize="md">List of materials:</Text>
          <Text fontSize="sm" color="gray.500">
            Leave it as empty to use random materials
          </Text>
        </VStack>
        <Button width="150px" variant="outline" onClick={handleAddMore}>
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

      {materials.some((mat) => mat.trim() !== "") ? (
        <Checkbox colorScheme="blue" isChecked={onlySpecified} onChange={(e) => setOnlySpecified(e.target.checked)} isDisabled={materials.every((mat) => mat.trim() === "")}>
          Use only these materials
        </Checkbox>
      ) : null}
    </VStack>
  );
};

export default MaterialInput;
