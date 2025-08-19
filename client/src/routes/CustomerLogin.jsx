import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../lib/api'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', mobile: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/customer/login', form)
      setAuthToken(data.token)
      navigate('/nearby')
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3>Customer Login</h3>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
        <label>
          <div>Name</div>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          <div>Email</div>
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          <div>Mobile</div>
          <input required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button disabled={loading} type="submit">{loading ? 'Submitting...' : 'Continue'}</button>
      </form>
    </div>
  )
}