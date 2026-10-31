import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATS = [
  { label: '📱 Mobiles', categoryId: 1 },
  { label: '💻 Laptops', categoryId: 1 },
  { label: '🎧 Audio', categoryId: 1 },
  { label: '📷 Cameras', categoryId: 1 },
  { label: '👗 Women Fashion', categoryId: 2 },
  { label: '👔 Men Fashion', categoryId: 2 },
  { label: '👟 Sneakers', categoryId: 2 },
  { label: '📚 Books', categoryId: 3 },
  { label: '🏠 Home & Kitchen', categoryId: 4 },
  { label: '⌚ Watches', categoryId: 1 },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hideCatBar = ['/', '/cart', '/checkout', '/orders'].includes(location.pathname) || location.pathname.startsWith('/admin')
  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [activeCat, setActiveCat] = useState(null)
  const [activeCatId, setActiveCatId] = useState(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login'); setShowMenu(false) }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  const goCategory = (cat) => {
    setActiveCat(cat.label)
    setActiveCatId(cat.categoryId)
    navigate(`/products?category=${cat.categoryId}`)
  }

  return (
    <nav style={styles.nav}>

      {/* ── Main Bar ── */}
      <div style={styles.mainBar}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoBox}>S</div>
          <span style={styles.logoText}>Shop<span style={styles.logoAccent}>Sphere</span></span>
        </Link>

        {/* Search — takes all remaining space */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" style={styles.clearX} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>

        {/* Right side */}
        <div style={styles.rightGroup}>

          {/* User / Auth */}
          {user ? (
            <div style={styles.userWrap} ref={dropdownRef}>
              <button style={styles.userBtn} onClick={() => setShowMenu(v => !v)}>
                <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                <div style={styles.userText}>
                  <span style={styles.userHi}>Hello,</span>
                  <span style={styles.userName}>{user.name?.split(' ')[0]}</span>
                </div>
                <span style={{ ...styles.chevron, transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </button>

              {showMenu && (
                <div style={styles.dropdown}>
                  {/* Profile Header */}
                  <div style={styles.dropHeader}>
                    <div style={styles.dropAvatar}>{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={styles.dropName}>{user.name}</p>
                      <p style={styles.dropEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div style={styles.dropDivider} />
                  {/* Menu Items */}
                  <Link to="/orders" style={styles.dropItem} onClick={() => setShowMenu(false)}>
                    <span style={styles.dropItemIcon}>📦</span>
                    <div>
                      <p style={styles.dropItemTitle}>My Orders</p>
                      <p style={styles.dropItemSub}>Track your orders</p>
                    </div>
                  </Link>
                  <Link to="/cart" style={styles.dropItem} onClick={() => setShowMenu(false)}>
                    <span style={styles.dropItemIcon}>🛒</span>
                    <div>
                      <p style={styles.dropItemTitle}>My Cart</p>
                      <p style={styles.dropItemSub}>View cart items</p>
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={styles.dropItem} onClick={() => setShowMenu(false)}>
                      <span style={styles.dropItemIcon}>⚙️</span>
                      <div>
                        <p style={styles.dropItemTitle}>Admin Panel</p>
                        <p style={styles.dropItemSub}>Manage store</p>
                      </div>
                    </Link>
                  )}
                  <div style={styles.dropDivider} />
                  <button style={styles.logoutBtn} onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.signupBtn}>Sign Up</Link>
            </div>
          )}

          {/* Cart */}
          <Link to="/cart" style={styles.cartBtn}>
            <span style={styles.cartIcon}>🛒</span>
            <span style={styles.cartText}>Cart</span>
          </Link>
        </div>
      </div>

      {/* ── Category Bar ── */}
      {!hideCatBar && <div style={styles.catBar}>
        {CATS.map(cat => (
          <button key={cat.label} style={{
            ...styles.catBtn,
            background: activeCat === cat.label ? 'rgba(124,58,237,0.25)' : 'transparent',
            color: activeCat === cat.label ? '#a78bfa' : 'rgba(255,255,255,0.65)',
            borderBottom: activeCat === cat.label ? '2px solid #7c3aed' : '2px solid transparent',
          }}
            onClick={() => goCategory(cat)}>
            {cat.label}
          </button>
        ))}
        {isAdmin && (
          <Link to="/admin" style={styles.adminBtn}>⚙️ Admin</Link>
        )}
      </div>}
    </nav>
  )
}

const styles = {
  nav: { position: 'sticky', top: 0, zIndex: 1000, width: '100%' },

  /* Main bar */
  mainBar: {
    width: '100%', background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.75rem 2rem',
  },

  /* Logo */
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 },
  logoBox: { width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '900', fontSize: '1.1rem', flexShrink: 0 },
  logoText: { color: '#fff', fontSize: '1.25rem', fontWeight: '900', whiteSpace: 'nowrap' },
  logoAccent: { color: '#a78bfa' },

  /* Search */
  searchForm: { flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: 0 },
  searchBox: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px',
    padding: '0 0.75rem', minWidth: 0 },
  searchIcon: { fontSize: '0.95rem', opacity: 0.45, flexShrink: 0 },
  searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none',
    color: '#fff', fontSize: '0.9rem', padding: '0.65rem 0', minWidth: 0 },
  clearX: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 },
  searchBtn: { background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none',
    padding: '0.6rem 1.4rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
    fontSize: '0.85rem', flexShrink: 0, whiteSpace: 'nowrap' },

  /* Right group */
  rightGroup: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },

  /* Auth buttons */
  authBtns: { display: 'flex', gap: '0.5rem' },
  loginBtn: { padding: '0.5rem 1.1rem', background: 'rgba(255,255,255,0.07)',
    color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  signupBtn: { padding: '0.5rem 1.1rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700',
    fontSize: '0.85rem', whiteSpace: 'nowrap' },

  /* User button */
  userWrap: { position: 'relative' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
    padding: '0.45rem 0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)', outline: 'none' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 },
  userText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  userHi: { color: '#666', fontSize: '0.65rem', lineHeight: 1 },
  userName: { color: '#fff', fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.3, whiteSpace: 'nowrap' },
  chevron: { color: '#666', fontSize: '0.7rem', transition: 'transform 0.2s' },

  /* Dropdown */
  dropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: '#111', border: '1px solid #222', borderRadius: '18px',
    minWidth: '250px', zIndex: 9999, overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)' },
  dropHeader: { display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1.2rem',
    background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.15))' },
  dropAvatar: { width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' },
  dropName: { margin: 0, fontWeight: '700', color: '#fff', fontSize: '0.92rem' },
  dropEmail: { margin: 0, color: '#666', fontSize: '0.75rem', marginTop: '2px' },
  dropDivider: { borderTop: '1px solid #1e1e1e', margin: '0' },
  dropItem: { display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.2rem',
    color: '#ccc', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s' },
  dropItemIcon: { fontSize: '1.3rem', flexShrink: 0 },
  dropItemTitle: { margin: 0, color: '#e5e5e5', fontWeight: '600', fontSize: '0.88rem' },
  dropItemSub: { margin: 0, color: '#555', fontSize: '0.72rem', marginTop: '1px' },
  logoutBtn: { width: '100%', padding: '0.85rem 1.2rem', background: 'none',
    border: 'none', color: '#f87171', cursor: 'pointer', textAlign: 'left',
    fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' },

  /* Cart */
  cartBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
    padding: '0.5rem 1rem', borderRadius: '10px', whiteSpace: 'nowrap' },
  cartIcon: { fontSize: '1.15rem' },
  cartText: { color: '#fff', fontWeight: '700', fontSize: '0.88rem' },

  /* Category bar */
  catBar: { width: '100%', background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '0 1.5rem',
    gap: '0.1rem' },
  catBtn: { padding: '0.65rem 1rem', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
    whiteSpace: 'nowrap', borderRadius: '6px 6px 0 0', border: 'none',
    transition: 'all 0.2s', background: 'transparent' },
  adminBtn: { marginLeft: 'auto', padding: '0.4rem 1rem', background: 'rgba(245,158,11,0.12)',
    color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '20px',
    textDecoration: 'none', fontSize: '0.78rem', fontWeight: '700', whiteSpace: 'nowrap',
    flexShrink: 0, alignSelf: 'center' },
}
