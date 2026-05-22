import { useState, useEffect, useCallback } from 'react'
import { getErrorMessage } from '../utils/helpers'

export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      setData(response.data.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}

export const useAsync = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (asyncFn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      return result
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute }
}
