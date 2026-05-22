import { FolderKanban, CheckSquare, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { dashboardAPI } from '../api/services'
import { StatCard, PageLoader, ProgressBar, Avatar, StatusBadge, PriorityBadge } from '../components/ui'
import { formatDate, isOverdue } from '../utils/helpers'
import useAuthStore from '../store/authStore'

export default function DashboardPage() {
  const { user, isAdmin } = useAuthStore()
  const { data, loading } = useFetch(() => dashboardAPI.get())

  if (loading) return <PageLoader />

  const admin = isAdmin()
  const stats = data?.stats || {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Good to see you, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1">
          {admin ? 'Here\'s your team\'s overview' : 'Here\'s your personal task overview'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {admin ? (
          <>
            <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderKanban} color="brand" />
            <StatCard label="Total Tasks"    value={stats.totalTasks}    icon={CheckSquare}  color="slate" />
            <StatCard label="Completed"      value={stats.doneTasks}     icon={TrendingUp}   color="green"
              sub={`${stats.completionRate}% completion rate`} />
            <StatCard label="Overdue"        value={stats.overdueTasks}  icon={AlertCircle}  color="red" />
          </>
        ) : (
          <>
            <StatCard label="Assigned Tasks" value={stats.assignedTasks} icon={CheckSquare} color="brand" />
            <StatCard label="Completed"      value={stats.doneTasks}     icon={TrendingUp}  color="green"
              sub={`${stats.completionRate}% done`} />
            <StatCard label="In Progress"    value={stats.inProgressTasks} icon={Clock}     color="amber" />
            <StatCard label="Overdue"        value={stats.overdueTasks}  icon={AlertCircle} color="red" />
          </>
        )}
      </div>

      {/* Admin: Recent projects + Team progress */}
      {admin && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="card">
            <h2 className="font-display font-semibold text-white mb-4">Recent Projects</h2>
            {data?.recentProjects?.length === 0 ? (
              <p className="text-slate-500 text-sm">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {data?.recentProjects?.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'var(--bg-3)' }}>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{p.title}</p>
                      <p className="text-xs text-slate-500">{p._count.tasks} tasks · {p._count.members} members</p>
                    </div>
                    <p className="text-xs text-slate-500">{formatDate(p.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Progress */}
          <div className="card">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-brand-400" /> Team Progress
            </h2>
            <div className="space-y-4">
              {data?.teamProgress?.filter(m => m.total > 0).map(member => (
                <div key={member.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={member.name} size="sm" />
                      <span className="text-sm text-slate-300">{member.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {member.done}/{member.total} done
                    </span>
                  </div>
                  <ProgressBar value={member.done} max={member.total} />
                </div>
              ))}
              {data?.teamProgress?.filter(m => m.total > 0).length === 0 && (
                <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Member: Upcoming tasks */}
      {!admin && data?.upcomingTasks?.length > 0 && (
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Upcoming Deadlines</h2>
          <div className="space-y-2">
            {data.upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: 'var(--bg-3)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.project?.title}</p>
                </div>
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <p className={`text-xs font-mono ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-slate-500'}`}>
                  {formatDate(task.dueDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member: My Projects */}
      {!admin && data?.myProjects?.length > 0 && (
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">My Projects</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.myProjects.map(p => (
              <div key={p.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-3)' }}>
                <p className="text-sm font-medium text-slate-200">{p.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p._count.tasks} tasks</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
