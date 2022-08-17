import { Button } from "@chakra-ui/react";
import { BaseModal } from "./BaseModal";

interface ErrorModalProps {
  title: string;
  isOpen: boolean;
  error?: {
    error: boolean;
    message: string;
  };
  onClose: () => void;
}

interface ErrorContentProps {
  error?: {
    error: boolean;
    message: string;
  };
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

function ErrorContent({ error }: ErrorContentProps): JSX.Element {
  const onHomeClick = () => {};
  const onRetryClick = () => {};
  return (
    <div>
      <p>{error?.message}</p>
      <ErrorButtons
        retryButtonAction={onRetryClick}
        homeButtonAction={onHomeClick}
      />
    </div>
  );
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  error,
}: ErrorModalProps): JSX.Element {
  return (
    <div>
      <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
        <ErrorContent error={error} />
      </BaseModal>
    </div>
  );
}
