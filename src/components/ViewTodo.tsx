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

interface Props {
  selected: TodoOut
  onClickReset: (todo: TodoOut | null) => void
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
      body: JSON.stringify(editorRef.current.getEditorState()),
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
    <Flex flexDir="column" flex="1" gap={5}>
      <Flex alignItems="center" gap={4} bg="white" boxShadow="md" p={2}>
        <Button size="sm" fontSize="3xl" onClick={() => props.onClickReset(null)}>
          ◀️
        </Button>
        <Heading fontWeight="light">{props.selected.title}</Heading>
        <Spacer />
        <Button isLoading={updateBody.isLoading} onClick={onClick} variant="outline" colorScheme="blue">
          {isEditable ? 'Save' : 'Edit'}
        </Button>
      </Flex>
      <Flex gap={5} alignItems={{ base: 'unset', md: 'flex-start' }} flexDir={{ base: 'column', md: 'row' }}>
        <Flex flex="1" boxShadow="md" overflow="auto" bg="white">
          {!isEditable && !props.selected.body && (
            <Flex bg="white" w="100%" h="300px" alignItems="center" justifyContent="center">
              <Button variant="outline" fontSize="3xl" size="lg" onClick={onClick}>
                Add Notes
              </Button>
            </Flex>
          )}
          {isEditable && (
            <Editor
              key={`edit-${props.selected.id}`}
              ref={editorRef}
              isEditable
              value={props.selected.body}
            />
          )}
          {!isEditable && props.selected.body && (
            <Editor
              key={`read-${props.selected.id}-${props.selected.body}`}
              ref={editorRef}
              isEditable={false}
              value={props.selected.body}
            />
          )}
        </Flex>
        <Flex minH="200px" w={{ base: 'unset', md: '30%' }} bg="white" flexDir="column" boxShadow="md">
          <Heading bg="blue.100" size="lg" textAlign="center" fontWeight="light">
            Checklist
          </Heading>
          <hr />
          <form ref={checklistFormRef} onSubmit={onSubmitChecklist}>
            <Input name="title" placeholder="new checklist item" borderRadius="0" />
            <Button type="submit" display="none">
              submit
            </Button>
          </form>
          <Flex ref={checklistref} flexDir="column">
            {checklists.data?.map((item) => (
              <Flex
                key={item.id}
                _hover={{ background: '#f8f8f8' }}
                borderBottom="1px solid #eee"
                flexDir="column"
              >
                <Checkbox isChecked={!!item.doneAt} onChange={onCheck(item.id)} p={2} size="lg">
                  {item.title}
                </Checkbox>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ViewTodo
