import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Full Name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Password (min 6 chars)"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#1a1a2e' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  footer: { textAlign: 'center', marginTop: '1rem', color: '#666' },
}
