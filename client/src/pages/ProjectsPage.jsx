import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, Pencil, Trash2, Users, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFetch, useAsync } from '../hooks/useFetch'
import { projectAPI } from '../api/services'
import { PageLoader, EmptyState, Modal, ConfirmDialog } from '../components/ui'
import { formatDate, getErrorMessage } from '../utils/helpers'
import useAuthStore from '../store/authStore'

function ProjectForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState({ title: initial?.title || '', description: initial?.description || '' })
  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Project Title *</label>
        <input name="title" value={form.title} onChange={handle}
          className="input" placeholder="e.g. Website Redesign" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handle}
          className="input resize-none" rows={3} placeholder="What is this project about?" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

export default function ProjectsPage() {
  const { isAdmin } = useAuthStore()
  const admin = isAdmin()
  const { data: projects, loading, refetch } = useFetch(() => projectAPI.getAll())
  const { execute, loading: mutating } = useAsync()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleCreate = async (form) => {
    try {
      await execute(() => projectAPI.create(form))
      toast.success('Project created!')
      setShowCreate(false)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleUpdate = async (form) => {
    try {
      await execute(() => projectAPI.update(editing.id, form))
      toast.success('Project updated!')
      setEditing(null)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleDelete = async () => {
    try {
      await execute(() => projectAPI.delete(deleting.id))
      toast.success('Project deleted')
      setDeleting(null)
      refetch()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-slate-500 mt-1">{projects?.length || 0} project{projects?.length !== 1 ? 's' : ''}</p>
        </div>
        {admin && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Projects grid */}
      {projects?.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description={admin ? "Create your first project to get started." : "You haven't been added to any projects yet."}
          action={admin && <button className="btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Project</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map(project => (
            <div key={project.id} className="card-hover group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center">
                  <FolderKanban size={16} className="text-brand-400" />
                </div>
                {admin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(project)} className="btn-ghost p-1.5 rounded-md" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleting(project)} className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <Link to={`/projects/${project.id}`} className="flex-1">
                <h3 className="font-display font-semibold text-white mb-1 hover:text-brand-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>
              </Link>

              <div className="divider my-3" />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> {project.members?.length || 0} members
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckSquare size={12} /> {project._count?.tasks || 0} tasks
                </span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} loading={mutating} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Project">
        {editing && <ProjectForm initial={editing} onSubmit={handleUpdate} loading={mutating} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleting?.title}"? All tasks will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={mutating}
      />
    </div>
  )
}
