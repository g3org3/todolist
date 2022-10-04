import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import ViewTodos from 'components/ViewTodos'

interface Props {
  //
}

const Todos = (props: Props) => {
  useSession({ required: true })
  const router = useRouter()

  return <ViewTodos onClickSelect={(todo) => router.push('/todos/' + todo.id)} />
}

export default Todos
