import { Input, Button, useToast } from '@chakra-ui/react'
import cuid from 'cuid'
import { useRef } from 'react'

import { getFormValues } from 'utils/form'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const CreateTodo = (props: Props) => {
  const toaster = useToast()
  const { invalidateQueries } = trpc.useContext()
  const formRef = useRef<HTMLFormElement>(null)
  const createTodo = trpc.useMutation('auth.create', {
    onSuccess() {
      invalidateQueries(['auth.todolist'])
      toaster({ title: 'success', status: 'success' })
    },
    onError(err) {
      toaster({ title: 'Error', description: err.message, status: 'error' })
    },
  })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const entity = getFormValues<{ title: { value: string } }>(formRef.current)
    if (!entity) return
    const title = entity.title.value
    createTodo.mutate({ id: cuid(), title })
    entity.title.value = ''
  }

  return (
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
  )
}

export default CreateTodo
