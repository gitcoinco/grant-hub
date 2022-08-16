import { Button } from "@chakra-ui/react";
import { BaseModal } from "./BaseModal";

interface ErrorModalProps {
  title: string;
  isOpen: boolean;
  // error?: {
  //   error: boolean;
  //   message: string;
  // };
  onClose: () => void;
}

interface ErrorButtonProps {
  retryButtonAction: () => void;
  homeButtonAction?: () => void;
}

function ErrorButtons({
  retryButtonAction,
  homeButtonAction,
}: ErrorButtonProps): JSX.Element {
  return (
    <div>
      <Button onClick={homeButtonAction}>Home</Button>
      <Button onClick={retryButtonAction}>Retry</Button>
    </div>
  );
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
}: ErrorModalProps): JSX.Element {
  const onHomeClick = () => {};
  const onRetryClick = () => {};
  return (
    <div>
      <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
        <ErrorButtons
          retryButtonAction={onRetryClick}
          homeButtonAction={onHomeClick}
        />
      </BaseModal>
    </div>
  );
}
