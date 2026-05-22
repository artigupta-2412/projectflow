import api from './axios'

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
  getMe:  ()     => api.get('/auth/me'),
  getUsers: ()   => api.get('/auth/users'),
}

// ─── Projects ────────────────────────────────────────────────────────────────
export const projectAPI = {
  getAll:    ()           => api.get('/projects'),
  getById:   (id)         => api.get(`/projects/${id}`),
  create:    (data)       => api.post('/projects', data),
  update:    (id, data)   => api.put(`/projects/${id}`, data),
  delete:    (id)         => api.delete(`/projects/${id}`),
  addMember:    (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, memberId) => api.delete(`/projects/${id}/members/${memberId}`),
  getMembers:   (id)      => api.get(`/projects/${id}/members`),
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const taskAPI = {
  getAll:       (params) => api.get('/tasks', { params }),
  getById:      (id)     => api.get(`/tasks/${id}`),
  create:       (data)   => api.post('/tasks', data),
  update:       (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete:       (id)     => api.delete(`/tasks/${id}`),
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}
