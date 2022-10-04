import { Container, Flex } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import CreateTodo from 'components/CreateTodo'
import Login from 'components/Login'
import Navbar from 'components/Navbar'
import ViewTodo from 'components/ViewTodo'
import ViewTodos from 'components/ViewTodos'
import { TodoOut } from 'utils/trpc'

const Home: NextPage = () => {
  const { status } = useSession()
  const [selected, setSelected] = useState<TodoOut | null>(null)
  const ref = useRef(null)

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref.current])

  return (
    <>
      <Head>
        <title>Todolist</title>
      </Head>
      <Flex h="100vh" overflow="auto" bg="blackAlpha.50" flexDir="column" gap={7}>
        <Navbar />
        <Container
          ref={ref}
          flex="1"
          maxW="container.xl"
          display="flex"
          flexDir="column"
          gap={5}
          overflow="auto"
        >
          {status === 'unauthenticated' && <Login />}
          {status === 'authenticated' && <CreateTodo />}
          {selected ? (
            <ViewTodo selected={selected} onClickReset={() => setSelected(null)} />
          ) : (
            <ViewTodos onClickSelect={setSelected} />
          )}
          <Flex mb={4} color="#999">
            Created by JA 🇬🇹 ❤️
          </Flex>
        </Container>
      </Flex>
    </>
  )
}

export default Home
