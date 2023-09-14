import { Flex, Link, Text, Container, VStack, useColorModeValue, Divider, Box } from "@chakra-ui/react";
import { footerData } from "../constants";

const Footer: React.FC = () => {
  const linkColor = useColorModeValue("gray.800", "gray.300");

  return (
    <Box>
      <Divider width="100%" />
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        <VStack spacing={5} alignItems="initial">
          <Flex flexWrap="wrap" direction={{ base: "column", md: "row" }} alignItems="start" justifyContent="space-between">
            {footerData.map((data, index) => (
              <Flex key={index} direction="column" mb="3">
                <Link fontWeight="500" href={data.href} color={linkColor}>
                  {data.label}
                </Link>
                <Flex direction={{ base: "row", md: "column" }}>
                  {data.links.map((link, index) => (
                    <Link key={index} padding={1} fontSize={{ base: "sm", sm: "md" }} href={link.href} mr={{ base: 1, sm: 2, md: 0 }} color="gray.500" _hover={{ color: "blue.600" }}>
                      {link.label}
                    </Link>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Flex alignItems="center">
            <Text color="gray.500" fontSize="0.875rem" pl="0.5rem">
              Powered by MakeMeDIYspire ✨ | Made with ❤️ by -
              <Link href="#" isExternal color="blue.500">
                Kooma
              </Link>
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
