import { Loader2 } from 'lucide-react'
import { statusConfig, priorityConfig } from '../../utils/helpers'

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export const Spinner = ({ size = 20, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-brand-400 ${className}`} />
)

// ─── Full-page loader ─────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-64">
    <Spinner size={28} />
  </div>
)

// ─── Status Badge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.TODO
  return <span className={config.class}>{config.label}</span>
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM
  return <span className={config.class}>{config.label}</span>
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-3)' }}>
        <Icon size={24} className="text-slate-500" />
      </div>
    )}
    <p className="font-medium text-slate-300 mb-1">{title}</p>
    {description && <p className="text-sm text-slate-500 mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
)

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon: Icon, color = 'brand', sub }) => {
  const colors = {
    brand:   { bg: 'bg-brand-500/10',   text: 'text-brand-400',   icon: 'text-brand-400' },
    green:   { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-400' },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   icon: 'text-amber-400' },
    red:     { bg: 'bg-red-500/10',     text: 'text-red-400',     icon: 'text-red-400' },
    purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-400',  icon: 'text-purple-400' },
    slate:   { bg: 'bg-slate-500/10',   text: 'text-slate-300',   icon: 'text-slate-400' },
  }
  const c = colors[color] || colors.brand

  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
            <Icon size={16} className={c.icon} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-display font-bold ${c.text}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card w-full max-w-sm animate-slide-up">
        <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner size={14} /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card w-full ${maxWidth} animate-slide-up`}
        style={{ background: 'var(--bg-2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-white">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-md">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, max = 100, color = '#0ea5e9', className = '' }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={`h-1.5 rounded-full overflow-hidden ${className}`} style={{ background: 'var(--bg-4)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ name, size = 'sm' }) => {
  const initials = (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}
