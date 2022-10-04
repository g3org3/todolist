import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  ModalProps,
} from '@chakra-ui/react'

interface Props extends Omit<ModalProps, 'onClose' | 'isOpen'> {
  title?: string
  onClose?: VoidFunction
  children: React.ReactNode
  close?: VoidFunction
}

const _Modal = (props: Props) => {
  const { isOpen, onClose } = useDisclosure({ isOpen: true })

  const onC = () => {
    onClose()
    if (props.close) props.close()
  }

  return (
    <>
      <Modal size={props.size} isOpen={isOpen} onClose={onC}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>{props.children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default _Modal
