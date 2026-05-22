import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, CheckSquare, User, LogOut, Zap } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderKanban,   label: 'Projects' },
  { to: '/tasks',     icon: CheckSquare,    label: 'Tasks' },
  { to: '/profile',   icon: User,           label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen border-r shrink-0"
      style={{ background: 'var(--bg-1)', borderColor: 'var(--border)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-white tracking-tight">ProjectFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Role badge */}
      <div className="px-4 pb-2">
        <div className="px-3 py-2 rounded-lg" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
          <p className="text-xs text-slate-500 mb-0.5">Logged in as</p>
          <p className="text-xs font-medium text-slate-300">{user?.role}</p>
        </div>
      </div>

      {/* User profile area */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
