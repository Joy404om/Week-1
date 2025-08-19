import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, setAuthToken } from '../lib/api'

export default function SalonVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const m = location.state?.mobile
    if (m) setMobile(m)
  }, [location.state])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/salon/verify-otp', { mobile, otp })
      setAuthToken(data.token)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3>Verify OTP</h3>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <label>
          <div>Mobile</div>
          <input required value={mobile} onChange={e => setMobile(e.target.value)} />
        </label>
        <label>
          <div>OTP</div>
          <input required value={otp} onChange={e => setOtp(e.target.value)} />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button disabled={loading} type="submit">{loading ? 'Verifying...' : 'Verify'}</button>
      </form>
    </div>
  )
}