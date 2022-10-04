import { ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'

interface Props {
  name?: string | null
  image?: string | null
  isAuthenticated?: boolean
}

const AvatarMenu = ({ name, image, isAuthenticated }: Props) => {
  return (
    <Menu>
      <MenuButton
        disabled={!isAuthenticated}
        as={Button}
        variant="ghost"
        borderRadius="0"
        rightIcon={isAuthenticated ? <ChevronDownIcon /> : null}
      >
        <Flex alignItems="center" gap={2}>
          <Avatar size="sm" name={name || undefined} src={image || undefined} />
          {name}
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default AvatarMenu
