import { Box, Button, VStack, Text } from "@chakra-ui/react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <VStack spacing={4} alignItems="center" justifyContent="center" height="100vh">
      <Box>
        <Text fontSize="xl" color="red.500">
          Something went wrong:
        </Text>
        <Text>{error.message}</Text>
      </Box>
      <Button colorScheme="blue" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </VStack>
  );
};

export default ErrorFallback;
