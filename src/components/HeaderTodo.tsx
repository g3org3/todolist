import { Button, Editable, EditableInput, EditablePreview, Heading, Input, Spacer } from '@chakra-ui/react'

import EditControls from './EditControls'

interface Props {
  onClickReset: VoidFunction
  onUpdateTitle: (title: string) => void
  isLoading?: boolean
  isEditable?: boolean
  title: string
  onClickEdit: VoidFunction
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
          gap={10}
          defaultValue={props.title}
          fontSize="5xl"
          isPreviewFocusable={false}
        >
          <EditablePreview />
          <Input fontSize="5xl" variant="unstyled" as={EditableInput} />
          <EditControls />
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
