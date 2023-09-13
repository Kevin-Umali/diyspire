import { Box, Text, Input, Stack, Button, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface ToolsAvailableInputProps {
  tools: string[];
  setTools: React.Dispatch<React.SetStateAction<string[]>>;
}

const ToolsAvailableInput: React.FC<ToolsAvailableInputProps> = ({ tools, setTools }) => {
  const handleInputChange = (index: number, value: string) => {
    const newTools = [...tools];
    newTools[index] = value;
    setTools(newTools);
  };

  const handleDeleteTool = (index: number) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    setTools(newTools);
  };

  return (
    <Box>
      <Text mb={2}>Available Tools:</Text>
      <Stack spacing={3}>
        {tools.map((tool, index) => (
          <InputGroup key={index}>
            <Input value={tool} placeholder="Enter a tool" onChange={(e) => handleInputChange(index, e.target.value)} />
            <InputRightElement>
              <IconButton aria-label="Delete tool" icon={<CloseIcon />} isDisabled={tools.length === 1} onClick={() => handleDeleteTool(index)} size="sm" />
            </InputRightElement>
          </InputGroup>
        ))}
        <Button variant="outline" onClick={() => setTools([...tools, ""])}>
          Add another tool
        </Button>
      </Stack>
    </Box>
  );
};

export default ToolsAvailableInput;
