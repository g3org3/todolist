import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { useEditableControls, ButtonGroup, IconButton, Flex } from '@chakra-ui/react'

interface Props {
  //
}

const EditControls = (props: Props) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton aria-label="save" icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton aria-label="cancel" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton aria-label="edit" size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
    </Flex>
  )
}

export default EditControls
