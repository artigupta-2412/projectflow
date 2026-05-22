import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { getErrorMessage } from '../utils/helpers'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'var(--bg-1)', borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">ProjectFlow</span>
        </div>

        <div>
          <blockquote className="text-2xl font-display font-semibold text-white leading-snug mb-4">
            "The best way to predict the future is to<br />
            <span className="text-brand-400">create it.</span>"
          </blockquote>
          <p className="text-slate-500 text-sm">Manage your projects. Ship faster.</p>
        </div>

        {/* Decorative grid */}
        <div className="grid grid-cols-3 gap-3 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg" style={{ background: 'var(--bg-3)' }} />
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-white mb-2">Sign in</h1>
            <p className="text-slate-400">Welcome back to ProjectFlow</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                name="email" type="email" value={form.email} onChange={handle}
                className="input" placeholder="you@example.com" required autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handle}
                  className="input pr-10" placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl text-xs space-y-1" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <p className="font-medium text-slate-400 mb-2">Demo accounts:</p>
            <p className="font-mono text-slate-400">admin@projectflow.dev / Admin@123</p>
            <p className="font-mono text-slate-400">alice@projectflow.dev / Member@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
