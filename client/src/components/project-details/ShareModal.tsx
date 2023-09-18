import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Box, Center, IconButton, Input, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useClipboard, useToast } from "@chakra-ui/react";
import { FaShareAlt } from "react-icons/fa";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  shareLink: string | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, isSaving, shareLink }) => {
  const { hasCopied, onCopy } = useClipboard(shareLink ?? "");
  const toast = useToast();

  const handleWebShare = async () => {
    if (navigator.share && shareLink) {
      try {
        await navigator.share({
          title: "Share this project",
          url: shareLink,
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "There was an error while sharing.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } else {
      toast({
        title: "Share Unavailable",
        description: "Web Share API is not supported in this browser.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const renderModalContent = () => {
    if (isSaving) {
      return (
        <Center flexDirection="column">
          <Spinner size="xl" mb={3} />
          <Text>Generating share link...</Text>
        </Center>
      );
    }

    if (shareLink) {
      return (
        <Box>
          <Input value={shareLink} isReadOnly mb={3} />
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <IconButton icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} aria-label="Copy Link" variant="outline" colorScheme="teal" mr={2} />
            <IconButton icon={<FaShareAlt />} onClick={handleWebShare} aria-label="Share Link" isDisabled={!navigator.share} variant="outline" colorScheme="blue" />
          </Box>
        </Box>
      );
    }

    return "An error occurred while generating the shareable link.";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="8px" p={5}>
        {!isSaving && (
          <>
            <ModalHeader fontSize={{ base: "xl", md: "2xl" }}>Share this project</ModalHeader>
            <ModalCloseButton />
          </>
        )}

        <ModalBody>{renderModalContent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
