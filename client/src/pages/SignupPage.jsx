import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { getErrorMessage } from '../utils/helpers'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [showPass, setShowPass] = useState(false)
  const { signup, loading } = useAuthStore()
  const navigate = useNavigate()

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    try {
      await signup(form)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">ProjectFlow</span>
        </div>

        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Create account</h1>
          <p className="text-slate-400">Start managing projects today</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input name="name" value={form.name} onChange={handle}
              className="input" placeholder="Jane Doe" required />
          </div>
          <div>
            <label className="label">Email address</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input name="password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handle}
                className="input pr-10" placeholder="Min 8 chars, A-z, 0-9, !@#" required />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select name="role" value={form.role} onChange={handle} className="input">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
