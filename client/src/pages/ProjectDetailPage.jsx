import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, UserMinus, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch, useAsync } from '../hooks/useFetch'
import { projectAPI, authAPI } from '../api/services'
import { PageLoader, Modal, ConfirmDialog, Avatar, StatusBadge, PriorityBadge } from '../components/ui'
import { formatDate, isOverdue, getErrorMessage } from '../utils/helpers'
import useAuthStore from '../store/authStore'

function AddMemberModal({ projectId, existingIds, onSuccess, onClose }) {
  const { data: users } = useFetch(() => authAPI.getUsers())
  const { execute, loading } = useAsync()
  const [selected, setSelected] = useState('')

  const available = users?.filter(u => !existingIds.includes(u.id)) || []

  const submit = async (e) => {
    e.preventDefault()
    if (!selected) return
    try {
      await execute(() => projectAPI.addMember(projectId, { userId: selected }))
      toast.success('Member added!')
      onSuccess()
      onClose()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Select User</label>
        <select value={selected} onChange={e => setSelected(e.target.value)} className="input" required>
          <option value="">— Choose a user —</option>
          {available.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
        {available.length === 0 && <p className="text-xs text-slate-500 mt-1">All users are already members.</p>}
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading || !selected}>
          {loading ? 'Adding…' : 'Add Member'}
        </button>
      </div>
    </form>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { isAdmin } = useAuthStore()
  const admin = isAdmin()

  const { data: project, loading, refetch } = useFetch(() => projectAPI.getById(id), [id])
  const { execute, loading: mutating } = useAsync()

  const [showAddMember, setShowAddMember] = useState(false)
  const [removingMember, setRemovingMember] = useState(null)

  const handleRemoveMember = async () => {
    try {
      await execute(() => projectAPI.removeMember(id, removingMember.id))
      toast.success('Member removed')
      setRemovingMember(null)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  if (loading) return <PageLoader />
  if (!project) return <div className="text-slate-400">Project not found.</div>

  const existingMemberIds = project.members?.map(m => m.user.id) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link to="/projects" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-4 w-fit">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">{project.title}</h1>
            {project.description && <p className="text-slate-400 mt-1">{project.description}</p>}
            <p className="text-xs text-slate-500 mt-2">
              Created by {project.createdBy?.name} · {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white">Tasks ({project.tasks?.length || 0})</h2>
            {admin && (
              <Link to={`/tasks?projectId=${id}`} className="btn-secondary text-xs py-1.5">
                <Plus size={13} /> Create Task
              </Link>
            )}
          </div>

          {project.tasks?.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-slate-500 text-sm">No tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {project.tasks?.map(task => {
                const overdue = isOverdue(task.dueDate, task.status)
                return (
                  <div key={task.id} className="card flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${overdue ? 'text-red-400' : 'text-slate-200'}`}>
                        {task.title}
                        {overdue && <span className="ml-2 text-xs text-red-500">⚠ Overdue</span>}
                      </p>
                      {task.assignedTo && (
                        <p className="text-xs text-slate-500 mt-0.5">→ {task.assignedTo.name}</p>
                      )}
                    </div>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    {task.dueDate && (
                      <p className={`text-xs font-mono ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
                        {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Members panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Users size={16} className="text-brand-400" /> Members
            </h2>
            {admin && (
              <button className="btn-ghost text-xs" onClick={() => setShowAddMember(true)}>
                <Plus size={13} /> Add
              </button>
            )}
          </div>

          <div className="card space-y-3">
            {project.members?.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <Avatar name={m.user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{m.user.name}</p>
                  <p className="text-xs text-slate-500">{m.user.role}</p>
                </div>
                {admin && m.user.id !== project.createdBy?.id && (
                  <button onClick={() => setRemovingMember(m)}
                    className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <UserMinus size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member">
        <AddMemberModal
          projectId={id}
          existingIds={existingMemberIds}
          onSuccess={refetch}
          onClose={() => setShowAddMember(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!removingMember}
        title="Remove Member"
        message={`Remove ${removingMember?.user?.name} from this project?`}
        onConfirm={handleRemoveMember}
        onCancel={() => setRemovingMember(null)}
        loading={mutating}
      />
    </div>
  )
}
