import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <div className="text-center animate-slide-up">
        <div className="font-display font-bold text-8xl text-slate-800 mb-4">404</div>
        <h1 className="font-display font-bold text-2xl text-white mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary">
          <Zap size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
