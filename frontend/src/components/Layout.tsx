import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const userName = user ? JSON.parse(user).name : ''

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>SupplyChainOG</Link>
          <nav style={{ display: 'flex', gap: 20 }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none' }}>Dashboard</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{userName}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Logout</button>
        </div>
      </header>
      <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
