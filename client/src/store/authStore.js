import { create } from 'zustand'
import { authAPI } from '../api/services'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  initialized: false,

  login: async (credentials) => {
    set({ loading: true })
    try {
      const { data } = await authAPI.login(credentials)
      const { user, token } = data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, token, loading: false })
      return { success: true }
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  signup: async (userData) => {
    set({ loading: true })
    try {
      const { data } = await authAPI.signup(userData)
      const { user, token } = data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, token, loading: false })
      return { success: true }
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  initialize: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ initialized: true })
      return
    }
    try {
      const { data } = await authAPI.getMe()
      const user = data.data
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, initialized: true })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ user: null, token: null, initialized: true })
    }
  },

  isAdmin: () => get().user?.role === 'ADMIN',
}))

export default useAuthStore
