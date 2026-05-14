import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import InsightAILogo from '../common/InsightAILogo'

/* ─── Password strength logic ──────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw || pw.length < 8) return { level: 0, label: 'Too short', color: '#ef4444' }
  const hasUpper   = /[A-Z]/.test(pw)
  const hasLower   = /[a-z]/.test(pw)
  const hasNum     = /\d/.test(pw)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw)
  const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length
  if (score <= 2) return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (score === 3) return { level: 2, label: 'Medium', color: '#eab308' }
  return             { level: 3, label: 'Strong',  color: '#22c55e' }
}

function StrengthBar({ password }) {
  const { level, label, color } = getStrength(password)
  if (!password) return null
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map((seg) => (
          <div key={seg} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: seg <= level ? color : 'var(--border-default)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11, color, fontWeight: 600 }}>{label}</p>
    </div>
  )
}

/* ─── Shared input ──────────────────────────────────────────────────────────── */
function AuthInput({ id, label, type, value, onChange, error, icon: Icon, rightSlot, placeholder, autoComplete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
          color: error ? 'var(--danger)' : 'var(--text-muted)', pointerEvents: 'none',
        }}>
          <Icon size={16} />
        </div>
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          style={{
            width: '100%', height: 52, boxSizing: 'border-box',
            padding: rightSlot ? '0 48px 0 46px' : '0 18px 0 46px',
            borderRadius: 12,
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
            background: 'var(--bg-elevated)', color: 'var(--text-primary)',
            fontSize: 14, fontFamily: 'DM Sans', outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)'
            e.target.style.boxShadow   = `0 0 0 3px ${error ? 'rgba(220,38,38,0.12)' : 'rgba(37,99,235,0.12)'}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-default)'
            e.target.style.boxShadow   = 'none'
          }}
        />
        {rightSlot && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p style={{ margin: 0, fontSize: 12, color: 'var(--danger)', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

/* ─── Social button ─────────────────────────────────────────────────────────── */
function SocialBtn({ label, logo }) {
  const [tip, setTip] = useState(false)
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <button type="button" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}
        style={{
          width: '100%', height: 48, borderRadius: 12,
          border: '1.5px solid var(--border-default)',
          background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
        }}>
        {logo}{label}
      </button>
      {tip && (
        <div style={{
          position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '5px 10px', fontSize: 12, color: 'var(--text-muted)',
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>Coming soon</div>
      )}
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export default function RegisterForm() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [showCf,   setShowCf]   = useState(false)
  const [agreed,   setAgreed]   = useState(false)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)

  const validate = () => {
    const e = {}
    if (!name.trim())           e.name     = 'Full name is required'
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email.trim())          e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password)              e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!confirm)               e.confirm  = 'Please confirm your password'
    else if (confirm !== password) e.confirm = 'Passwords do not match'
    if (!agreed)                e.agreed   = 'You must agree to the Terms of Service'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login()
    navigate('/', { replace: true })
  }

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
        <InsightAILogo size={40} />
        <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', fontFamily: 'DM Sans' }}>InsightAI</span>
      </div>

      <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'DM Sans' }}>
        Create your account
      </h1>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--text-muted)' }}>
        Start your free analytics journey
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          id="name" label="Full Name" type="text"
          value={name} onChange={(e) => setName(e.target.value)}
          error={errors.name} icon={User}
          placeholder="John Doe" autoComplete="name"
        />

        <AuthInput
          id="email" label="Email address" type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          error={errors.email} icon={Mail}
          placeholder="you@company.com" autoComplete="email"
        />

        {/* Password + strength indicator */}
        <div>
          <AuthInput
            id="password" label="Password" type={showPw ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
            error={errors.password} icon={Lock}
            placeholder="Min. 8 characters" autoComplete="new-password"
            rightSlot={
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <StrengthBar password={password} />
        </div>

        <AuthInput
          id="confirm" label="Confirm Password" type={showCf ? 'text' : 'password'}
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm} icon={Lock}
          placeholder="Confirm your password" autoComplete="new-password"
          rightSlot={
            <button type="button" onClick={() => setShowCf((p) => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
              {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        {/* Terms checkbox */}
        <div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: 15, height: 15, cursor: 'pointer', marginTop: 2, flexShrink: 0 }} />
            <span>
              I agree to the{' '}
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, padding: 0 }}>Terms of Service</button>
              {' '}and{' '}
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, padding: 0 }}>Privacy Policy</button>
            </span>
          </label>
          {errors.agreed && <p style={{ margin: '4px 0 0 25px', fontSize: 12, color: 'var(--danger)', fontWeight: 500 }}>{errors.agreed}</p>}
        </div>

        {/* Create Account button */}
        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', height: 52, borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'DM Sans',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)' } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)' }}
          onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)' }}
        >
          {loading ? (
            <><Loader2 size={17} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
          ) : 'Create Account'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <SocialBtn label="Google" logo={
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          } />
          <SocialBtn label="GitHub" logo={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          } />
        </div>

        <p style={{ textAlign: 'center', margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
