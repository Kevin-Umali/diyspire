import { Menu, MenuButton, MenuItem, MenuList, Button, Text, Box, BoxProps } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface PurposeFilterProps extends BoxProps {
  purpose: string;
  onPurposeChange: (purpose: string) => void;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({ purpose, onPurposeChange, ...props }) => {
  return (
    <Box {...props}>
      <Text mb={2}>End Result Purpose:</Text>
      <Menu>
        {({ onClose }) => (
          <>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="200px" variant="outline">
              {purpose ?? "Select Purpose"}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  onPurposeChange("Personal Use");
                  onClose();
                }}
              >
                Personal Use
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPurposeChange("Gift");
                  onClose();
                }}
              >
                Gift
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPurposeChange("Other");
                  onClose();
                }}
              >
                Other
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default PurposeFilter;
