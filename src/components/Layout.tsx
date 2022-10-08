import { Flex, Container } from '@chakra-ui/react'
import autoAnimate from '@formkit/auto-animate'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useRef } from 'react'

import Navbar from 'components/Navbar'

interface Props {
  children: React.ReactNode
}

const Layout = (props: Props) => {
  const ref = useRef(null)
  const { status } = useSession()

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [ref.current])

  return (
    <>
      <Head>
        <title>Todolist</title>
      </Head>
      {status === 'authenticated' ? (
        <Flex h="100vh" overflow="auto" bg="blackAlpha.50" flexDir="column" gap={3}>
          <Navbar />
          <Container
            ref={ref}
            flex="1"
            maxW="container.xl"
            display="flex"
            flexDir="column"
            gap={2}
            overflow="auto"
          >
            {props.children}
            <Flex mb={4} color="#999">
              Created by JA 🇬🇹 ❤️
            </Flex>
          </Container>
        </Flex>
      ) : (
        props.children
      )}
    </>
  )
}

export default Layout
