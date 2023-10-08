import { Check, Copy, Share2 } from "lucide-react";

import useClipboard from "@/hooks/useClipboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  shareLink: string | null;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, isSaving, shareLink }) => {
  const { hasCopied, onCopy } = useClipboard(shareLink ?? "");
  const { toast } = useToast();

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
        });
      }
    } else {
      toast({
        title: "Share Unavailable",
        description: "Web Share API is not supported in this browser.",
      });
    }
  };

  const renderModalContent = () => {
    if (isSaving) {
      return (
        <div className="flex flex-col items-center">
          <div className="loader my-3"></div>
          <Label className="text-center">Generating share link...</Label>
        </div>
      );
    }

    if (shareLink) {
      return (
        <div>
          <Input value={shareLink} readOnly className="mb-3" />
          <div className="flex items-center">
            <Button onClick={onCopy} disabled={!shareLink} aria-label={hasCopied ? "Link Copied" : "Copy Link"}>
              {hasCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
            <Button onClick={handleWebShare} disabled={!navigator.share} aria-label="Share Link">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} aria-labelledby="share-dialog-title">
      <DialogContent className="p-5">
        <DialogHeader>
          {!isSaving && (
            <>
              <DialogTitle id="share-dialog-title" className="text-xl md:text-2xl">
                Share this project
              </DialogTitle>
              <DialogDescription>Use the link below to share this project.</DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="py-4">{renderModalContent()}</div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
