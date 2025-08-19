import { Outlet, Link } from 'react-router-dom'

export default function Root() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
      <header style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: '#111', textDecoration: 'none', fontWeight: 700, fontSize: 20 }}>BookMyGlow</Link>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
          <Link to="/nearby" style={{ textDecoration: 'none' }}>Nearby</Link>
        </nav>
      </header>
      <main style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

