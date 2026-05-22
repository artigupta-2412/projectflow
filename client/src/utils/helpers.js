import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy')
}

export const formatRelative = (date) => {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'DONE') return false
  return isPast(new Date(dueDate))
}

export const getDueDateLabel = (dueDate) => {
  if (!dueDate) return null
  const d = new Date(dueDate)
  if (isToday(d)) return 'Due today'
  if (isTomorrow(d)) return 'Due tomorrow'
  if (isPast(d)) return `Overdue (${formatDate(dueDate)})`
  return formatDate(dueDate)
}

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'
  )
}

export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const statusConfig = {
  TODO:        { label: 'To Do',       class: 'badge-todo',        color: '#94a3b8' },
  IN_PROGRESS: { label: 'In Progress', class: 'badge-in-progress', color: '#f59e0b' },
  DONE:        { label: 'Done',        class: 'badge-done',        color: '#10b981' },
}

export const priorityConfig = {
  LOW:    { label: 'Low',    class: 'badge-low',    color: '#64748b' },
  MEDIUM: { label: 'Medium', class: 'badge-medium', color: '#0ea5e9' },
  HIGH:   { label: 'High',   class: 'badge-high',   color: '#ef4444' },
}
