import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import DashboardPage    from './pages/DashboardPage'
import FunnelPage       from './pages/FunnelPage'
import ABTestPage       from './pages/ABTestPage'
import AIReportPage     from './pages/AIReportPage'
import MetricDetailPage from './pages/MetricDetailPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'

/* Wrapper that redirects unauthenticated users to /login */
function PrivateRoute() {
  const { isAuth } = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* All dashboard routes are protected */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard/:metric" element={<MetricDetailPage />} />
                <Route path="funnel" element={<FunnelPage />} />
                <Route path="abtest" element={<ABTestPage />} />
                <Route path="ai" element={<AIReportPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
