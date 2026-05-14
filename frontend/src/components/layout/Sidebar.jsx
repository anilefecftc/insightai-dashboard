import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingDown, FlaskConical, Bot,
  ChevronLeft, ChevronRight, Menu, X, Sun, Moon, LogOut,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import InsightAILogo from '../common/InsightAILogo'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/funnel', icon: TrendingDown, label: 'Funnel Analysis' },
  { to: '/abtest', icon: FlaskConical, label: 'A/B Testing' },
  { to: '/ai', icon: Bot, label: 'AI Reports' },
]

function NavContent({ collapsed, onNavClick }) {
  return (
    <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavClick}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'background 0.15s ease, color 0.15s ease',
            position: 'relative',
            color: isActive ? 'var(--nav-active-color)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-glow)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={17} style={{ color: isActive ? 'var(--accent-light)' : 'inherit', flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function ThemeToggle({ collapsed }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
        padding: collapsed ? '10px 0' : '10px 12px',
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        color: 'var(--text-muted)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.15s ease, color 0.15s ease',
        fontFamily: 'DM Sans',
        marginBottom: 4,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-elevated)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-muted)'
      }}
    >
      {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
      {/* Toggle track */}
      <div
        style={{
          position: 'relative',
          width: 36,
          height: 20,
          borderRadius: 10,
          background: isDark ? 'var(--accent-glow)' : 'rgba(234,179,8,0.2)',
          border: `1px solid ${isDark ? 'var(--accent)' : '#ca8a04'}`,
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: isDark ? 2 : 16,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: isDark ? 'var(--accent-light)' : '#ca8a04',
            transition: 'left 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark
            ? <Moon size={8} color="#fff" />
            : <Sun size={8} color="#fff" />
          }
        </div>
      </div>
    </button>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 768) setCollapsed(true)
      else if (window.innerWidth >= 1280) setCollapsed(false)
    }
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const sidebarStyle = {
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--sidebar-border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 300ms ease, background 0.25s ease',
    flexShrink: 0,
    zIndex: 20,
  }

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <InsightAILogo size={34} />
      <div style={{ overflow: 'hidden' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.01em' }}>
          InsightAI
        </p>
      </div>
    </div>
  )

  const BottomSection = ({ compact }) => {
    const { logout } = useAuth()
    const nav = useNavigate()
    const handleLogout = () => { logout(); nav('/login', { replace: true }) }

    return (
    <div style={{ padding: '8px 8px 12px', borderTop: '1px solid var(--sidebar-border)' }}>
      <ThemeToggle collapsed={compact} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Sign out"
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          gap: 10,
          padding: compact ? '10px 0' : '10px 12px',
          borderRadius: 10, border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          transition: 'background 0.15s ease, color 0.15s ease',
          fontFamily: 'DM Sans', marginBottom: 4,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <LogOut size={15} />
        {!compact && <span>Sign out</span>}
      </button>

      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          gap: 10,
          padding: compact ? '10px 0' : '10px 12px',
          borderRadius: 10,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.15s ease, color 0.15s ease',
          fontFamily: 'DM Sans',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-elevated)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        {compact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!compact && <span>Collapse</span>}
      </button>
    </div>
  )
  }

  if (isMobile) {
    return (
      <>
        <button
          className="no-print"
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed', top: 16, left: 16, zIndex: 30,
            width: 40, height: 40, borderRadius: 10,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={18} />
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 25, backdropFilter: 'blur(2px)',
            }}
          />
        )}

        <aside style={{
          ...sidebarStyle,
          position: 'fixed', top: 0, left: 0, height: '100vh', width: 240,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease',
          minHeight: '100vh',
        }}>
          <div style={{
            padding: '18px 16px',
            borderBottom: '1px solid var(--sidebar-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
          <NavContent collapsed={false} onNavClick={() => setMobileOpen(false)} />
          <BottomSection compact={false} />
        </aside>
      </>
    )
  }

  return (
    <aside className="no-print" style={{ ...sidebarStyle, width: collapsed ? 72 : 240, minHeight: '100vh' }}>
      <div style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <InsightAILogo size={34} />
        {!collapsed && (
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.01em' }}>
            InsightAI
          </p>
        )}
      </div>

      <NavContent collapsed={collapsed} onNavClick={undefined} />
      <BottomSection compact={collapsed} />
    </aside>
  )
}
