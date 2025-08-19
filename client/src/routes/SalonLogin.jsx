import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function SalonLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', mobile: '', address: '', mapLink: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugOtp, setDebugOtp] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/salon/login-start', form)
      setDebugOtp(data.debugOtp || '')
      navigate('/login/salon/verify', { state: { mobile: data.mobile } })
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to start login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3>Salon / Beauty Parlour Login</h3>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 500 }}>
        <label>
          <div>Salon/Parlour Name</div>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          <div>Mobile Number</div>
          <input required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
        </label>
        <label>
          <div>Shop Address</div>
          <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </label>
        <label>
          <div>Google Map Link</div>
          <input required value={form.mapLink} onChange={e => setForm({ ...form, mapLink: e.target.value })} />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {debugOtp && <div style={{ color: '#555' }}>Debug OTP: {debugOtp}</div>}
        <button disabled={loading} type="submit">{loading ? 'Sending OTP...' : 'Send OTP'}</button>
      </form>
    </div>
  )
}