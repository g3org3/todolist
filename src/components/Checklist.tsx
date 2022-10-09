import { Heading, Input, Button, Flex, Checkbox, useToast, SkeletonText, Skeleton } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import cuid from 'cuid'
import { useRef, useEffect } from 'react'

import { getFormValues } from 'utils/form'
import { trpc } from 'utils/trpc'

interface Props {
  todoId?: string
}

const Checklist = (props: Props) => {
  const checklists = trpc.useQuery(['auth.checklist', props.todoId!], { enabled: !!props.todoId })
  const { invalidateQueries } = trpc.useContext()
  const toaster = useToast()
  const createChecklist = trpc.useMutation('auth.createChecklist', {
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
  const checklistref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checklistref.current && autoAnimate(checklistref.current)
  }, [checklistref])

  const onCheck = (id: string) => (e: any) => {
    doneChecklist.mutate({ id, isChecked: e.target.checked })
  }

  const onSubmitChecklist: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const entity = getFormValues<{ title: { value: string } }>(checklistFormRef.current)
    if (!entity || !props.todoId || createChecklist.isLoading) return
    const title = entity.title.value
    createChecklist.mutate({ id: cuid(), title, todoId: props.todoId })
    entity.title.value = ''
  }

  return (
    <>
      <Heading size="lg" textAlign="center" fontWeight="light">
        Checklist
      </Heading>
      <hr />
      <form ref={checklistFormRef} onSubmit={onSubmitChecklist}>
        <Input
          disabled={createChecklist.isLoading}
          name="title"
          placeholder="new checklist item"
          borderRadius="0"
        />
        <Button type="submit" display="none">
          submit
        </Button>
      </form>
      <Flex ref={checklistref} flexDir="column" flex="1">
        {createChecklist.isLoading && (
          <Flex _hover={{ background: '#f8f8f8' }} borderBottom="1px solid #eee" alignItems="center">
            <Checkbox flex="1" p={2} size="lg">
              <Skeleton w="150px" h="20px" />
            </Checkbox>
            <Button display="none" size="sm" colorScheme="red" variant="outline" mr={2}>
              X
            </Button>
          </Flex>
        )}
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
            <Button display="none" size="sm" colorScheme="red" variant="outline" mr={2}>
              X
            </Button>
          </Flex>
        ))}
      </Flex>
    </>
  )
}

export default Checklist
