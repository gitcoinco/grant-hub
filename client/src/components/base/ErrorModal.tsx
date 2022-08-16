import { Button } from "@chakra-ui/react";
import { BaseModal } from "./BaseModal";

interface ErrorModalProps {
  title?: string;
  homeButtonText?: string;
  retryButtonText?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ErrorButtonProps {
  retryButtonAction: () => void;
  homeButtonAction?: () => void;
}



function ErrorButtons({ retryButtonAction, homeButtonAction }: ErrorButtonProps) {
  return (
    <div>
      <Button onClick={homeButtonAction}>Home</Button>
      <Button onClick={retryButtonAction}>Retry</Button>
    </div>
  );
}

export function ErrorModal({ isOpen, onClose, title }: ErrorModalProps) {
  return (
    <div>
      <BaseModal
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        children={<ErrorButtons retryButtonAction={() => {}} homeButtonAction={() => {}} />}
      />
    </div>
    );
}
