import { Flex, Badge, Button, Text, useToast } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import { DateTime } from 'luxon'
import { useEffect, useRef } from 'react'

import { TodoOut, trpc } from 'utils/trpc'

interface Props {
  onClickSelect: (todo: TodoOut) => void
}

const ViewTodos = (props: Props) => {
  const ref = useRef(null)
  const toaster = useToast()
  const { invalidateQueries } = trpc.useContext()
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

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref])

  const onDelete = (id: string) => () => {
    deleteTodo.mutate(id)
  }
  const onDone = (id: string, isChecked: boolean) => () => {
    doneTodo.mutate({ id, isChecked })
  }

  return (
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
  )
}

export default ViewTodos
