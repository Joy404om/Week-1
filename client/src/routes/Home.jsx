import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div>
      <h2>Welcome to BookMyGlow</h2>
      <p>Book salon and beauty parlour services near you.</p>

      <button onClick={() => setShowOptions(s => !s)} style={{ padding: '8px 12px', marginTop: 12 }}>
        {showOptions ? 'Hide Login Options' : 'Login'}
      </button>

      {showOptions && (
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <Link to="/login/customer">
            <button style={{ padding: '8px 12px' }}>Customer</button>
          </Link>
          <Link to="/login/salon">
            <button style={{ padding: '8px 12px' }}>Salon / Beauty Parlour</button>
          </Link>
        </div>
      )}
    </div>
  )
}