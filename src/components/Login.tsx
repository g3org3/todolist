import { Flex, Heading, Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

interface Props {
  //
}

const Login = (props: Props) => {
  return (
    <Flex flexDir="column" alignItems="center" gap={4}>
      <Heading size="3xl" fontWeight="light">
        Login
      </Heading>
      <Button onClick={() => signIn('google')} size="lg" colorScheme="blue">
        login with Google
      </Button>
    </Flex>
  )
}

export default Login
