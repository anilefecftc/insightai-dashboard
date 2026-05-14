import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const { isAuth } = useAuth()
  const navigate   = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true })
  }, [isAuth, navigate])

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
