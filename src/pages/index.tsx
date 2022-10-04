import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Login from 'components/Login'

const Home: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/todos')
    }
  }, [status])

  return <Login />
}

export default Home
