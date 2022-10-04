import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react'

interface Props {
  title?: string
  onClose?: VoidFunction
  children: React.ReactNode
}

const _Modal = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: true })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default _Modal
