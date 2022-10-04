import { Flex, Badge, Button, Text, useToast, Input, useDisclosure } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useRef, useState } from 'react'

import { TodoOut, trpc } from 'utils/trpc'

import CreateTodo from './CreateTodo'
import Modal from './Modal'

interface Props {
  onClickSelect: (todo: TodoOut) => void
}

const ViewTodos = (props: Props) => {
  const ref = useRef(null)
  const toaster = useToast()
  const [showAll, setShowAll] = useState(true)
  const [search, setSearch] = useState('')
  const { invalidateQueries } = trpc.useContext()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const todos = trpc.useQuery(['auth.todolist'])
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
  const handleKeyPress = useCallback(
    (event: any) => {
      if (!isOpen && event.key === 'n') {
        event.preventDefault()
        onOpen()
      }
    },
    [isOpen]
  )

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress)

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref])

  const onDelete = (id: string) => () => {
    deleteTodo.mutate(id)
  }
  const onDone = (id: string, isChecked: boolean) => () => {
    doneTodo.mutate({ id, isChecked })
  }

  const filteredTodos =
    todos.data
      ?.filter((x) => showAll || !x.doneAt)
      .filter((x) => !search || x.title.toLowerCase().includes(search.toLowerCase())) || []

  return (
    <>
      {isOpen && (
        <Modal size="4xl" close={onClose}>
          <CreateTodo onSuccess={onClose} />
        </Modal>
      )}
      <Flex gap={4}>
        <Button isActive={showAll} onClick={() => setShowAll(!showAll)} colorScheme="green" variant="outline">
          show all
        </Button>
        <Input bg="white" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search" />
        <Button onClick={() => setSearch('')} variant="outline">
          clear
        </Button>
      </Flex>
      <Flex flexDir="column" ref={ref} flex="1" overflow="auto" gap={2}>
        {filteredTodos.map((x) => (
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
              onClick={() => props.onClickSelect(x)}
              flex="1"
              p={5}
              fontSize="3xl"
              textDecor={x.doneAt ? 'line-through' : undefined}
            >
              {x.title}
            </Text>
            {x.doneAt && (
              <Badge position="absolute" top="0" right="0" colorScheme="green">
                Done: {DateTime.fromJSDate(x.doneAt).toRelative()}
              </Badge>
            )}
            <Flex>
              <Button
                fontSize="3xl"
                colorScheme="green"
                variant="ghost"
                size="sm"
                onClick={onDone(x.id, !x.doneAt)}
              >
                ✅
              </Button>

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
    </>
  )
}

export default ViewTodos
