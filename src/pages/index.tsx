import {
  Badge,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import { Todo } from '@prisma/client'
import cuid from 'cuid'
import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import Editor from 'components/Editor/Editor'
import { getFormValues } from 'utils/form'
import { TodoOut, trpc } from 'utils/trpc'

const Home: NextPage = () => {
  const toaster = useToast()
  const todos = trpc.useQuery(['auth.todolist'])
  const { invalidateQueries } = trpc.useContext()
  const doneTodo = trpc.useMutation('auth.done', {
    onSuccess() {
      invalidateQueries(['auth.todolist'])
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
  const deleteTodo = trpc.useMutation('auth.delete', {
    onSuccess() {
      invalidateQueries(['auth.todolist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const createTodo = trpc.useMutation('auth.create', {
    onSuccess() {
      invalidateQueries(['auth.todolist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const [selected, setSelected] = useState<TodoOut | null>(null)
  const checklists = trpc.useQuery(['auth.checklist', selected?.id!], {
    enabled: !!selected?.id,
  })
  const createChecklist = trpc.useMutation('auth.createChecklist', {
    onSuccess() {
      invalidateQueries(['auth.checklist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })
  const formRef = useRef<HTMLFormElement>(null)
  const checklistFormRef = useRef<HTMLFormElement>(null)
  const ref = useRef(null)
  const checklistref = useRef(null)

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref])

  useEffect(() => {
    checklistref.current && autoAnimate(checklistref.current)
  }, [checklistref])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const entity = getFormValues<{ title: { value: string } }>(formRef.current)
    if (!entity) return
    const title = entity.title.value
    createTodo.mutate({ id: cuid(), title })
    entity.title.value = ''
  }
  const onSwap = (i: number) => () => {
    if (i === 0) return
  }
  const onDelete = (id: string) => () => {
    deleteTodo.mutate(id)
  }
  const onDone = (id: string) => () => {
    doneTodo.mutate(id)
  }
  const onCheck = (id: string) => (e: any) => {
    doneChecklist.mutate({ id, isChecked: e.target.checked })
  }

  const onSubmitChecklist: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const entity = getFormValues<{ title: { value: string } }>(checklistFormRef.current)
    if (!entity || !selected) return
    const title = entity.title.value
    createChecklist.mutate({ id: cuid(), title, todoId: selected.id })
    entity.title.value = ''
  }

  return (
    <Flex h="100vh" overflow="auto" padding={4} bg="blackAlpha.50">
      <Container maxW="container.xl" display="flex" flexDir="column" gap={5} overflow="auto">
        <Heading display="flex">
          Todolist
          <Spacer />
          <Button onClick={() => signIn('google')}>login</Button>
        </Heading>
        <form ref={formRef} onSubmit={onSubmit}>
          <Input
            transition="background 400ms"
            _hover={{ background: 'white' }}
            _focus={{ background: 'white' }}
            size="lg"
            name="title"
            disabled={createTodo.isLoading}
            placeholder="another todo 🥸?"
          />
          <Button type="submit" display="none">
            add
          </Button>
        </form>
        {selected ? (
          <Flex flexDir="column" flex="1" gap={5}>
            <Flex alignItems="center" gap={4} bg="white" boxShadow="md" p={2}>
              <Button size="sm" fontSize="3xl" onClick={() => setSelected(null)}>
                ◀️
              </Button>
              <Heading fontWeight="light">{selected.title}</Heading>
            </Flex>
            <Flex gap={5} alignItems="flex-start">
              <Flex flex="1" boxShadow="md">
                <Editor />
              </Flex>
              <Flex minH="200px" w="30%" bg="white" flexDir="column" boxShadow="md">
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
        ) : (
          <Flex flexDir="column" ref={ref} flex="1" overflow="auto" gap={2}>
            {todos.data?.map((x, i) => (
              <Flex
                alignItems={{ base: 'unset', md: 'center' }}
                gap={{ base: 0, md: 4 }}
                boxShadow="md"
                border="1px solid #eee"
                bg="white"
                borderRadius="10px"
                key={x.id}
                position="relative"
                flexDir={{ base: 'column', md: 'row' }}
              >
                <Badge position="absolute" bottom="0" right="0" fontSize="10px">
                  {x.id}
                </Badge>
                <Text
                  borderRadius="10px"
                  transition="background 300ms"
                  _hover={{ background: 'blue.100' }}
                  cursor="pointer"
                  onClick={() => setSelected(x)}
                  flex="1"
                  p={5}
                  fontSize="3xl"
                  textDecor={x.doneAt ? 'line-through' : undefined}
                >
                  {x.title}
                </Text>
                {x.doneAt && (
                  <Badge position="absolute" top="0" right="0" colorScheme="green">
                    Done: {x.doneAt.toISOString()}
                  </Badge>
                )}
                <Flex>
                  {!x.doneAt && (
                    <Button
                      fontSize="3xl"
                      colorScheme="green"
                      variant="ghost"
                      size="sm"
                      onClick={onDone(x.id)}
                    >
                      ✅
                    </Button>
                  )}
                  <Button
                    mr={5}
                    fontSize="3xl"
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    onClick={onDelete(x.id)}
                  >
                    ❌
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Container>
    </Flex>
  )
}

export default Home
