import { Flex, Container, Heading, Spacer } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import AvatarMenu from './AvatarMenu'

interface Props {
  //
}

const Navbar = (props: Props) => {
  const { status, data } = useSession()

  return (
    <Flex boxShadow="md" bg="white">
      <Container display="flex" maxW="container.xl" alignItems="center">
        <Heading fontSize="3xl" display="flex" fontWeight="light">
          <Link href={status === 'authenticated' ? '/todos' : '/'}>Todolist</Link>
        </Heading>
        <Spacer />
        <AvatarMenu
          isAuthenticated={status === 'authenticated'}
          name={data?.user?.name}
          image={data?.user?.image}
        />
      </Container>
    </Flex>
  )
}

export default Navbar
