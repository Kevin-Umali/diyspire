import { Box, Text, Input, Stack, Button, InputGroup, InputRightElement, IconButton, BoxProps } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useCallback } from "react";

interface ToolsAvailableInputProps extends BoxProps {
  tools: string[];
  setTools: React.Dispatch<React.SetStateAction<string[]>>;
}

const ToolsAvailableInput: React.FC<ToolsAvailableInputProps> = ({ tools, setTools, ...props }) => {
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
    <Box {...props}>
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
