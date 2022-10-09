import { Editable, EditablePreview, Input, EditableInput, Flex, Badge, useToast } from '@chakra-ui/react'

import { trpc } from 'utils/trpc'

import EditControls from './EditControls'

interface Props {
  todoId: string
  tag: string | null
}

const ManageTage = (props: Props) => {
  const toaster = useToast()
  const { invalidateQueries } = trpc.useContext()
  const updateTag = trpc.useMutation(['auth.update-tag'], {
    onSuccess() {
      invalidateQueries(['auth.todoid', props.todoId])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })

  const onSubmitTag = (tag: string) => {
    updateTag.mutate({ id: props.todoId, tag })
  }

  return (
    <Flex p={2} flexDir="column">
      <Badge>label</Badge>
      <Editable
        display="flex"
        alignItems="center"
        defaultValue={props.tag || 'no label'}
        fontSize="xl"
        onSubmit={onSubmitTag}
        isPreviewFocusable={false}
        gap={2}
      >
        <EditablePreview flex="1" />
        <Input flex="1" fontSize="xl" variant="unstyled" as={EditableInput} />
        <EditControls />
      </Editable>
    </Flex>
  )
}

export default ManageTage
