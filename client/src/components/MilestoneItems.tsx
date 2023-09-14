import { BoxProps, useColorModeValue, Flex, Circle, Box } from "@chakra-ui/react";

import { FiCheckCircle } from "react-icons/fi";

interface MilestoneItemProps extends BoxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  boxProps?: BoxProps;
  skipTrail?: boolean;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ icon = FiCheckCircle, boxProps = {}, skipTrail = false, children, ...props }) => {
  const color = useColorModeValue("gray.700", "gray.500");
  return (
    <Flex minH={20} {...props}>
      <Flex flexDir="column" alignItems="center" mr={4} pos="relative">
        <Circle size={12} bg={useColorModeValue("gray.600", "gray.500")} opacity={useColorModeValue(0.07, 0.15)} />
        <Box as={icon} size="1.25rem" color={color} pos="absolute" left="0.875rem" top="0.875rem" />
        {!skipTrail && <Box w="1px" flex={1} bg={color} my={1} />}
      </Flex>
      <Box pt={{ base: 1, sm: 3 }} {...boxProps}>
        {children}
      </Box>
    </Flex>
  );
};

export default MilestoneItem;
