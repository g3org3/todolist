import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
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
  const state = useDisclosure({ isOpen: true })

  const onClose = () => {
    state.onClose()
    if (props.close) props.close()
  }

  return (
    <>
      <Modal size={props.size} isOpen={state.isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        {props.title && <ModalHeader>{props.title}</ModalHeader>}
        <ModalContent>
          <ModalBody>{props.children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default _Modal
