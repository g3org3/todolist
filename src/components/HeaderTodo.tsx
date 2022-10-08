import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  IconButton,
  Input,
  Spacer,
  useEditableControls,
} from '@chakra-ui/react'

interface Props {
  onClickReset: VoidFunction
  onUpdateTitle: (title: string) => void
  isLoading?: boolean
  isEditable?: boolean
  title: string
  onClickEdit: VoidFunction
}

function EditableControls() {
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

const HeaderTodo = (props: Props) => {
  return (
    <>
      <Button h="100%" variant="outline" size="sm" fontSize="3xl" onClick={props.onClickReset}>
        ◀️
      </Button>
      <Heading fontWeight="light">
        <Editable
          key={props.title}
          onSubmit={props.onUpdateTitle}
          display="flex"
          alignItems="center"
          gap={2}
          defaultValue={props.title}
          fontSize="5xl"
          isPreviewFocusable={false}
        >
          <EditablePreview />
          <Input fontSize="5xl" variant="unstyled" as={EditableInput} />
          <EditableControls />
        </Editable>
      </Heading>
      <Spacer />
      <Button
        isLoading={props.isLoading}
        onClick={props.onClickEdit}
        variant={props.isEditable ? 'solid' : 'outline'}
        colorScheme={props.isEditable ? 'blue' : 'orange'}
      >
        {props.isEditable ? 'Save' : 'Edit'}
      </Button>
    </>
  )
}

export default HeaderTodo
