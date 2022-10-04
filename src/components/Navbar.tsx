import { Flex, Container, Heading, Spacer } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

import AvatarMenu from './AvatarMenu'

interface Props {
  //
}

const Navbar = (props: Props) => {
  const { status, data } = useSession()

  return (
    <Flex py={2} boxShadow="md" bg="white">
      <Container display="flex" maxW="container.xl">
        <Heading display="flex" fontWeight="light">
          Todolist
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
