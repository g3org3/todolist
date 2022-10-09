import { Flex, Button, useToast } from '@chakra-ui/react'
import { LexicalEditor } from 'lexical'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import Checklist from 'components/Checklist'
import Editor from 'components/Editor'
import HeaderTodo from 'components/HeaderTodo'
import ManageTag from 'components/ManageTag'
import { useShortcut } from 'utils/shortcuts'
import { TodoOut, trpc } from 'utils/trpc'

interface Props {
  selected: TodoOut
  onClickReset: VoidFunction
}

const ViewTodo = (props: Props) => {
  const toaster = useToast()
  const router = useRouter()
  const { invalidateQueries } = trpc.useContext()
  const editorRef = useRef<LexicalEditor>()
  const [isEditable, setEditable] = useState(false)
  useShortcut(
    {
      Escape: () => router.push('/todos'),
    },
    []
  )
  const updateBody = trpc.useMutation('auth.update', {
    onSuccess() {
      invalidateQueries(['auth.todoid', props.selected.id])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })

  const onSave = () => {
    if (!editorRef.current) return

    updateBody.mutate({
      id: props.selected.id,
      title: props.selected.title,
      body: JSON.stringify(editorRef.current.getEditorState()),
    })
  }

  const onUpdateTitle = (title: string) => {
    updateBody.mutate({
      id: props.selected.id,
      title,
    })
  }

  const onClick = () => {
    if (isEditable) {
      onSave()
      setEditable(false)
    } else {
      setEditable(true)
    }
  }

  return (
    <Flex
      flexDir="column"
      flex="1"
      overflow="auto"
      boxShadow="md"
      bg="white"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
    >
      <Flex alignItems="center" gap={4} p={2}>
        <HeaderTodo
          onUpdateTitle={onUpdateTitle}
          onClickReset={props.onClickReset}
          title={props.selected.title}
          isEditable={isEditable}
          isLoading={updateBody.isLoading}
          onClickEdit={onClick}
        />
      </Flex>
      <Flex overflow="auto" flex="1" flexDir={{ base: 'column', md: 'row' }}>
        <Flex flex="1" overflow="auto" bg="white">
          {!isEditable && !props.selected.body && (
            <Flex bg="white" w="100%" h="300px" alignItems="center" justifyContent="center">
              <Button variant="outline" fontSize="3xl" size="lg" onClick={onClick}>
                Add Notes
              </Button>
            </Flex>
          )}
          {isEditable && (
            <Editor
              key={`edit-${props.selected.id}-${props.selected.body.length}`}
              ref={editorRef}
              isEditable
              value={props.selected.body}
            />
          )}
          {!isEditable && props.selected.body && (
            <Editor
              key={`read-${props.selected.id}-${props.selected.body.length}`}
              ref={editorRef}
              isEditable={false}
              value={props.selected.body}
            />
          )}
        </Flex>
        <Flex w={{ base: 'unset', md: '30%' }} flexDir="column" py={1}>
          <ManageTag tag={props.selected.tag} todoId={props.selected.id} />
          <Checklist todoId={props.selected.id} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ViewTodo
