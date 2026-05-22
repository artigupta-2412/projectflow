import { User, Mail, Shield, Calendar } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { Avatar } from '../components/ui'
import { formatDate } from '../utils/helpers'

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--bg-3)' }}>
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-sm font-medium ${highlight ? 'text-brand-400' : 'text-slate-200'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="text-slate-500 mt-1">Your account information</p>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <p className="font-display font-bold text-xl text-white">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="divider" />
        <div className="space-y-4">
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow icon={Shield} label="Role" value={user?.role} highlight />
          <InfoRow icon={Calendar} label="Member Since" value={formatDate(user?.createdAt)} />
        </div>
      </div>

      <div className="card" style={{ background: 'var(--bg-2)' }}>
        <h3 className="font-medium text-slate-300 mb-3">Your Permissions</h3>
        {user?.role === 'ADMIN' ? (
          <ul className="space-y-2 text-sm text-slate-400">
            {['Create and manage projects','Add/remove project members','Create, edit, and delete tasks','Assign tasks to team members','View full team analytics'].map(p => (
              <li key={p} className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {p}</li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2 text-sm text-slate-400">
            {[['✓','View assigned projects'],['✓','View and update your assigned tasks'],['✓','Update task status on your tasks'],['✗','Create or manage projects'],['✗','Create or delete tasks']].map(([icon, p]) => (
              <li key={p} className="flex items-center gap-2">
                <span className={icon === '✓' ? 'text-emerald-400' : 'text-slate-600'}>{icon}</span> {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
