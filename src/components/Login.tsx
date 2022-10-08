import { Flex, Heading, Button, Image, Text } from '@chakra-ui/react'
import { signIn, useSession } from 'next-auth/react'

interface Props {
  //
}

const Login = (props: Props) => {
  const { status } = useSession()

  if (status === 'authenticated') return null

  return (
    <Flex h="100vh" w="100vw" flexDir={{ base: 'column', md: 'row' }}>
      <Flex position="relative" flex={{ base: 'unset', md: '1' }} h={{ base: '200px', md: 'unset' }}>
        <Text
          fontFamily="monospace"
          position="absolute"
          fontSize={{ base: '3xl', md: '6xl' }}
          color="white"
          bg="black"
          top={{ base: 'calc(50% - 20px)', md: 'calc(50% - 45px)' }}
          px={4}
          left={{ base: 'calc(50% - 169px)', md: 'calc(50% - 322px)' }}
        >
          - Todo List App -
        </Text>
        <Image
          alt="img"
          objectFit="cover"
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
        />
      </Flex>
      <Flex
        flexDir="column"
        w={{ base: 'unset', md: '40%' }}
        gap={4}
        alignItems="center"
        justifyContent="center"
      >
        <Heading size="3xl" fontWeight="light">
          Welcome! <br />
        </Heading>
        <Button fontSize="2xl" onClick={() => signIn('google')} size="lg" variant="outline">
          Sign in with Google
        </Button>
      </Flex>
    </Flex>
  )
}

export default Login
