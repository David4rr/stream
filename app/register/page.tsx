'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RegisterPage from '@/components/auth/register-page'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/auth-slice'
import { getGoogleOAuthUrl } from '@/app/actions/auth/google-auth'

export default function RegisterPageDemo() {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleGoogleLogin = async () => {
    const result = await getGoogleOAuthUrl()
    if (result.success) {
      window.location.href = result.authUrl
    } else {
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/beranda')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <RegisterPage
      onLoginClick={handleLoginClick}
      onGoogleLogin={handleGoogleLogin}
    />
  )
}
