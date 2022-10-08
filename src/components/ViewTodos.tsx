import { Flex, Badge, Button, Text, useToast, Input, useDisclosure } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { useShortcut } from 'utils/shortcuts'
import { TodoOut, trpc } from 'utils/trpc'

import CreateTodo from './CreateTodo'
import Modal from './Modal'

interface Props {
  onClickSelect: (todo: TodoOut) => void
}

const ViewTodos = (props: Props) => {
  const ref = useRef(null)
  const toaster = useToast()
  const router = useRouter()
  const createTodoModalState = useDisclosure()
  const searchModalState = useDisclosure()
  const [search, setSearch] = useState('')
  const todos = trpc.useQuery(['auth.todolist'])
  useShortcut(
    {
      Escape: (e: any) => {
        if (search) {
          e.preventDefault()
          setSearch('')
        }
      },
      n: (e: any) => {
        if (!searchModalState.isOpen && !createTodoModalState.isOpen) {
          e.preventDefault()
          createTodoModalState.onOpen()
        }
      },
      1: (e: any) => {
        if (!searchModalState.isOpen && !createTodoModalState.isOpen && todos.data && todos.data[0]) {
          router.push(`/todos/${todos.data[0].id}`)
          e.preventDefault()
        }
      },
      'meta-k': (e: any) => {
        if (!searchModalState.isOpen) {
          e.preventDefault()
          searchModalState.onOpen()
        }
      },
      '/': (e: any) => {
        if (!searchModalState.isOpen) {
          e.preventDefault()
          searchModalState.onOpen()
        }
      },
    },
    [search, searchModalState.isOpen, createTodoModalState.isOpen]
  )
  const [showAll, setShowAll] = useState(true)
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
  const deleteTodo = trpc.useMutation('auth.delete', {
    onSuccess() {
      invalidateQueries(['auth.todolist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref])

  const onDelete = (id: string) => () => {
    deleteTodo.mutate(id)
  }
  const onDone = (id: string, isChecked: boolean) => () => {
    doneTodo.mutate({ id, isChecked })
  }
  const searchRef = useRef<HTMLInputElement>(null)
  const onSearch = () => {
    const value = searchRef.current?.value || ''
    setSearch(value)
    searchModalState.onClose()
  }

  const filteredTodos =
    todos.data
      ?.filter((x) => showAll || !x.doneAt)
      .filter((x) => !search || x.title.toLowerCase().includes(search.toLowerCase())) || []

  return (
    <>
      {createTodoModalState.isOpen && (
        <Modal size="4xl" close={createTodoModalState.onClose}>
          <CreateTodo onSuccess={createTodoModalState.onClose} />
        </Modal>
      )}
      {searchModalState.isOpen && (
        <Modal size="4xl" close={searchModalState.onClose}>
          <form onSubmit={onSearch}>
            <Input placeholder="search" fontSize="4xl" variant="unstyled" ref={searchRef} />
            <Button display="none">submit</Button>
          </form>
        </Modal>
      )}
      {!!todos.data?.length && (
        <Flex gap={2} py={2} alignItems="center">
          <Text display={{ base: 'none', md: 'block' }} fontSize="xl" color="gray.400">
            Actions:
          </Text>
          <Button
            isActive={showAll}
            onClick={() => setShowAll(!showAll)}
            colorScheme="green"
            variant="outline"
          >
            show all
          </Button>
          <Button
            colorScheme={!!search ? 'blue' : 'blue'}
            isActive={!!search}
            onClick={() => (search ? setSearch('') : searchModalState.onOpen())}
            variant="outline"
          >
            {search ? 'clear search: ' + search : 'search'}
          </Button>
          <Button colorScheme="purple" onClick={() => createTodoModalState.onOpen()} variant="outline">
            new todo
          </Button>
        </Flex>
      )}
      <Flex flexDir="column" ref={ref} flex="1" overflow="auto" gap={2}>
        {todos.data?.length === 0 && (
          <Flex flexDir="column" alignItems="center" justifyContent="center" height="30%">
            <Text fontSize="5xl">Create your first todo</Text>
            <Button onClick={() => createTodoModalState.onOpen()} colorScheme="purple" size="lg">
              create new todo
            </Button>
          </Flex>
        )}
        {filteredTodos.map((x) => (
          <Flex
            alignItems={{ base: 'unset', md: 'strecht' }}
            boxShadow="md"
            border="1px solid #eee"
            bg="white"
            borderRadius="10px"
            key={x.id}
            position="relative"
            flexDir={{ base: 'column', md: 'row' }}
          >
            <Text
              borderRadius="10px"
              borderRightRadius="0"
              transition="background 300ms"
              _hover={{ background: 'blue.100' }}
              cursor="pointer"
              onClick={() => props.onClickSelect(x)}
              flex="1"
              p={5}
              fontSize="3xl"
              textDecor={x.doneAt ? 'line-through' : undefined}
            >
              {x.title}
            </Text>
            {x.doneAt && (
              <Badge zIndex="2" position="absolute" top="0" left="0" colorScheme="green">
                Done: {DateTime.fromJSDate(x.doneAt).toRelative()}
              </Badge>
            )}
            <Flex display={{ base: 'none', md: 'flex' }}>
              <Button
                height="100%"
                _hover={{ bg: 'green.200' }}
                borderRadius="0"
                fontSize="3xl"
                px={6}
                colorScheme="green"
                variant="ghost"
                size="sm"
                isActive={!!x.doneAt}
                onClick={onDone(x.id, !x.doneAt)}
              >
                ✅
              </Button>
              <Button
                height="100%"
                borderRadius="0"
                _hover={{ bg: 'red.100' }}
                px={6}
                fontSize="3xl"
                colorScheme="red"
                variant="ghost"
                borderRightRadius="10px"
                size="sm"
                onClick={onDelete(x.id)}
              >
                ❌
              </Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}

export default ViewTodos
