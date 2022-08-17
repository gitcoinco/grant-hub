import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex justify-end mt-4">
      <Button className="m-2 p-2" onClick={homeButtonAction}>
        Home
      </Button>
      <Button
        className="m-2 p-2"
        colorScheme="purple"
        onClick={retryButtonAction}
      >
        Refresh Page
      </Button>
    </div>
  );
}

function ErrorContent({ error }: ErrorContentProps): JSX.Element {
  const navigate = useNavigate();

  const onHomeClick = () => {
    navigate("/");
  };

  const onRetryClick = () => {
    window.location.reload();
  };

  return (
    <div className="mt-4">
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
