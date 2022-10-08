import { Flex, Button, Heading, Input, Checkbox, useToast, Spacer } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import cuid from 'cuid'
import { LexicalEditor } from 'lexical'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { getFormValues } from 'utils/form'
import { useShortcut } from 'utils/shortcuts'
import { TodoOut, trpc } from 'utils/trpc'

import Editor from './Editor'
import HeaderTodo from './HeaderTodo'

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
  const checklists = trpc.useQuery(['auth.checklist', props.selected.id], { enabled: !!props.selected.id })
  const createChecklist = trpc.useMutation('auth.createChecklist', {
    onSuccess() {
      invalidateQueries(['auth.checklist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const updateBody = trpc.useMutation('auth.update', {
    onSuccess() {
      invalidateQueries(['auth.checklist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const doneChecklist = trpc.useMutation('auth.checklistdone', {
    onSuccess() {
      invalidateQueries(['auth.checklist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const checklistFormRef = useRef<HTMLFormElement>(null)
  const checklistref = useRef(null)

  useEffect(() => {
    checklistref.current && autoAnimate(checklistref.current)
  }, [checklistref])

  const onCheck = (id: string) => (e: any) => {
    doneChecklist.mutate({ id, isChecked: e.target.checked })
  }

  const onSubmitChecklist: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const entity = getFormValues<{ title: { value: string } }>(checklistFormRef.current)
    if (!entity || !props.selected) return
    const title = entity.title.value
    createChecklist.mutate({ id: cuid(), title, todoId: props.selected.id })
    entity.title.value = ''
  }

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
    <Flex flexDir="column" flex="1" overflow="auto" boxShadow="md" bg="white">
      <Flex
        alignItems="center"
        gap={4}
        bg="white"
        p={2}
        borderTopLeftRadius="10px"
        borderTopRightRadius="10px"
      >
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
        <Flex w={{ base: 'unset', md: '30%' }} flexDir="column">
          <Heading size="lg" textAlign="center" fontWeight="light">
            Checklist
          </Heading>
          <hr />
          <form ref={checklistFormRef} onSubmit={onSubmitChecklist}>
            <Input name="title" placeholder="new checklist item" borderRadius="0" />
            <Button type="submit" display="none">
              submit
            </Button>
          </form>
          <Flex ref={checklistref} flexDir="column" flex="1">
            {checklists.data?.map((item) => (
              <Flex
                key={item.id}
                _hover={{ background: '#f8f8f8' }}
                borderBottom="1px solid #eee"
                alignItems="center"
              >
                <Checkbox flex="1" isChecked={!!item.doneAt} onChange={onCheck(item.id)} p={2} size="lg">
                  {item.title}
                </Checkbox>
                <Button size="sm" colorScheme="red" variant="outline" mr={2}>
                  X
                </Button>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ViewTodo
