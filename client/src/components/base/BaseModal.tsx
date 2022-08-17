import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: JSX.Element;
  title?: string;
  footer?: JSX.Element;
};

export function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  footer,
}: BaseModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <>
          <ModalHeader px={8} pb={1} pt={6}>
            {title}
          </ModalHeader>
          <ModalCloseButton mr={2} />
          <ModalBody p={0}>
            <div className="px-8 pb-4">
              {/* JSX Element passed in */}
              {children}
            </div>
          </ModalBody>

          {footer && <div>{footer}</div>}
        </>
      </ModalContent>
    </Modal>
  );
}
