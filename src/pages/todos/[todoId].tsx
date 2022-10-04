import { Flex, Spinner } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import ViewTodo from 'components/ViewTodo'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const TodoId = (props: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const todoId = router.query.todoId as string
  const todo = trpc.useQuery(['auth.todoid', todoId])

  if (todo.isLoading) {
    return (
      <Flex>
        <Spinner />
      </Flex>
    )
  }

  return <ViewTodo selected={todo.data!} onClickReset={() => router.push('/todos')} />
}

export default TodoId