import { Box, Text, Link } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box bg="green.600" p={4} mt={8}>
      <Text textAlign="center" color="white">
        Powered by MakeMeDIYspire ✨ | Made with ❤️ by -
        <Link href="#" isExternal color="blue.400">
          Kooma
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
