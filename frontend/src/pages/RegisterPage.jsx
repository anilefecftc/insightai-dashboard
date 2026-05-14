import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  const { isAuth } = useAuth()
  const navigate   = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true })
  }, [isAuth, navigate])

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
