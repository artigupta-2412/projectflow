import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, CheckSquare, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch, useAsync } from '../hooks/useFetch'
import { taskAPI, projectAPI, authAPI } from '../api/services'
import { PageLoader, EmptyState, Modal, ConfirmDialog, StatusBadge, PriorityBadge } from '../components/ui'
import { formatDate, isOverdue, getErrorMessage } from '../utils/helpers'
import useAuthStore from '../store/authStore'

function TaskForm({ initial, onSubmit, loading }) {
  const { data: projects } = useFetch(() => projectAPI.getAll())
  const { data: users }    = useFetch(() => authAPI.getUsers())
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({
    title:        initial?.title        || '',
    description:  initial?.description  || '',
    status:       initial?.status       || 'TODO',
    priority:     initial?.priority     || 'MEDIUM',
    dueDate:      initial?.dueDate      ? initial.dueDate.split('T')[0] : '',
    projectId:    initial?.project?.id  || searchParams.get('projectId') || '',
    assignedToId: initial?.assignedTo?.id || '',
  })

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input name="title" value={form.title} onChange={handle}
          className="input" placeholder="Task title" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handle}
          className="input resize-none" rows={2} placeholder="Optional details…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handle} className="input">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select name="priority" value={form.priority} onChange={handle} className="input">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Project *</label>
          <select name="projectId" value={form.projectId} onChange={handle} className="input" required>
            <option value="">— Select project —</option>
            {projects?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input name="dueDate" type="date" value={form.dueDate} onChange={handle} className="input" />
        </div>
      </div>
      <div>
        <label className="label">Assign To</label>
        <select name="assignedToId" value={form.assignedToId} onChange={handle} className="input">
          <option value="">— Unassigned —</option>
          {users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}

function StatusQuickChange({ task, onUpdate }) {
  const { execute, loading } = useAsync()
  const next = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }
  const nextLabel = { TODO: 'Start', IN_PROGRESS: 'Complete', DONE: 'Reset' }

  const handleClick = async () => {
    try {
      await execute(() => taskAPI.updateStatus(task.id, next[task.status]))
      onUpdate()
      toast.success('Status updated')
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  return (
    <button onClick={handleClick} disabled={loading}
      className="text-xs px-2 py-1 rounded-md transition-colors text-slate-400 hover:text-white hover:bg-white/10">
      {loading ? '…' : nextLabel[task.status]}
    </button>
  )
}

export default function TasksPage() {
  const { isAdmin } = useAuthStore()
  const admin = isAdmin()
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    status: '', priority: '', projectId: searchParams.get('projectId') || '', search: '',
  })

  const { data: projects } = useFetch(() => projectAPI.getAll())
  const { data: tasks, loading, refetch } = useFetch(
    () => taskAPI.getAll(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))),
    [filters.status, filters.priority, filters.projectId, filters.search]
  )
  const { execute, loading: mutating } = useAsync()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing]       = useState(null)
  const [deleting, setDeleting]     = useState(null)

  const setFilter = (key, val) => setFilters(p => ({ ...p, [key]: val }))

  const handleCreate = async (form) => {
    try {
      await execute(() => taskAPI.create(form))
      toast.success('Task created!')
      setShowCreate(false)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleUpdate = async (form) => {
    try {
      await execute(() => taskAPI.update(editing.id, form))
      toast.success('Task updated!')
      setEditing(null)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleDelete = async () => {
    try {
      await execute(() => taskAPI.delete(deleting.id))
      toast.success('Task deleted')
      setDeleting(null)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="text-slate-500 mt-1">{tasks?.length || 0} task{tasks?.length !== 1 ? 's' : ''}</p>
        </div>
        {admin && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={filters.search} onChange={e => setFilter('search', e.target.value)}
              className="input pl-8 py-2 text-sm" placeholder="Search tasks…" />
          </div>
          <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
            className="input w-auto py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select value={filters.priority} onChange={e => setFilter('priority', e.target.value)}
            className="input w-auto py-2 text-sm">
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select value={filters.projectId} onChange={e => setFilter('projectId', e.target.value)}
            className="input w-auto py-2 text-sm">
            <option value="">All Projects</option>
            {projects?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters({ status: '', priority: '', projectId: '', search: '' })}
              className="btn-ghost text-xs py-2">Clear</button>
          )}
        </div>
      </div>

      {/* Task list */}
      {tasks?.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={admin ? 'Create your first task to get started.' : 'No tasks match your filters.'}
          action={admin && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={14} /> New Task
            </button>
          )}
        />
      ) : (
        <div className="space-y-2">
          {tasks?.map(task => {
            const overdue = isOverdue(task.dueDate, task.status)
            return (
              <div key={task.id}
                className={`card flex items-center gap-4 group transition-all ${overdue ? 'border-red-500/20' : ''}`}>
                {overdue && <div className="w-1 h-8 rounded-full bg-red-500 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${overdue ? 'text-red-300' : 'text-slate-100'}`}>
                      {task.title}
                    </p>
                    {overdue && <span className="text-xs text-red-500 font-medium">Overdue</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500">{task.project?.title}</span>
                    {task.assignedTo && (
                      <span className="text-xs text-slate-500">→ {task.assignedTo.name}</span>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
                {task.dueDate && (
                  <p className={`text-xs font-mono hidden md:block ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
                    {formatDate(task.dueDate)}
                  </p>
                )}
                <StatusQuickChange task={task} onUpdate={refetch} />
                {admin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(task)} className="btn-ghost p-1.5 rounded-md">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleting(task)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Task" maxWidth="max-w-xl">
        <TaskForm onSubmit={handleCreate} loading={mutating} />
      </Modal>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Task" maxWidth="max-w-xl">
        {editing && <TaskForm initial={editing} onSubmit={handleUpdate} loading={mutating} />}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete Task"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={mutating}
      />
    </div>
  )
}
