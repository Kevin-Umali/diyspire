import React from "react";
import { Box, Text, NumberInput, NumberInputField, HStack, BoxProps, Menu, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface TimeAvailabilityFilterProps extends BoxProps {
  timeValue: number;
  timeUnit: string | null;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
}

const TimeAvailabilityFilter: React.FC<TimeAvailabilityFilterProps> = ({ timeValue, timeUnit, onValueChange, onUnitChange, ...props }) => {
  const handleValueChange = (_: string, valueAsNumber: number) => {
    if (isNaN(valueAsNumber)) {
      onValueChange(0);
    } else {
      onValueChange(valueAsNumber);
    }
  };

  const handleUnitChange = (unit: string) => {
    onUnitChange(unit);
  };

  return (
    <Box {...props}>
      <Text mb={2}>Available Time: {timeValue !== 0 && timeUnit ? `${timeValue} ${timeUnit}` : null}</Text>
      <HStack spacing={4}>
        <NumberInput min={0} onChange={handleValueChange} value={timeValue}>
          <NumberInputField />
        </NumberInput>
        <Menu>
          {({ onClose }) => (
            <>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="200px" variant="outline">
                {timeUnit ?? "Select unit"}
              </MenuButton>
              <MenuList>
                {["minutes", "hours", "days", "weeks", "months"].map((unit) => (
                  <MenuItem
                    key={unit}
                    onClick={() => {
                      handleUnitChange(unit);
                      onClose();
                    }}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}(s)
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>
      </HStack>
    </Box>
  );
};

export default TimeAvailabilityFilter;
