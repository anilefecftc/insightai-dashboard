import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <main
          key={location.pathname}
          className="page-enter"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(24px, 3vw, 36px)',
            paddingTop: 'clamp(24px, 3vw, 36px)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
