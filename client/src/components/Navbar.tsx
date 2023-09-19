import { Box, Flex, Heading, IconButton, Link, useColorMode } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={{ base: "1rem", md: "1.5rem" }}
      bg={colorMode === "light" ? "white" : "gray.800"}
      color={colorMode === "light" ? "gray.600" : "white"}
      boxShadow="sm"
      width="100%"
    >
      <Flex align="center" mr={5}>
        <Box display={{ base: "block", md: "none" }} mr="2"></Box>
        <Box>
          <Heading size={{ base: "sm", md: "md" }}>
            <Link as={RouterLink} to={{ pathname: "/" }} _hover={{ textDecoration: "none" }} cursor={"pointer"}>
              MakeMeDIYspire
            </Link>
          </Heading>
        </Box>
      </Flex>

      <Box display="flex" alignItems="center">
        <IconButton as="a" href="https://github.com/Kevin-Umali/make-me" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" icon={<FaGithub />} size="sm" mr={2} />
        <IconButton
          aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
          variant="ghost"
          colorScheme="blue"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
        />
      </Box>
    </Flex>
  );
};

export default Navbar;
