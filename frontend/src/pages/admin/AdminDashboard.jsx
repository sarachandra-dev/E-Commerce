import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })

  useEffect(() => {
    Promise.all([productService.getAll(), orderService.getAllOrders()]).then(([pRes, oRes]) => {
      const orders = oRes.data
      setStats({
        products: pRes.data.length,
        orders: orders.length,
        revenue: orders.filter(o => o.status !== 'CANCELLED')
                       .reduce((sum, o) => sum + o.totalAmount, 0),
        pending: orders.filter(o => o.status === 'PENDING').length,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, color: '#3b82f6', icon: '📦' },
    { label: 'Total Orders', value: stats.orders, color: '#10b981', icon: '🛒' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: '#e94560', icon: '💰' },
    { label: 'Pending Orders', value: stats.pending, color: '#f59e0b', icon: '⏳' },
  ]

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <div style={styles.grid}>
        {cards.map(card => (
          <div key={card.label} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
            <span style={styles.icon}>{card.icon}</span>
            <p style={styles.value}>{card.value}</p>
            <p style={styles.label}>{card.label}</p>
          </div>
        ))}
      </div>
      <div style={styles.links}>
        <Link to="/admin/products" style={styles.link}>Manage Products →</Link>
        <Link to="/admin/orders" style={styles.link}>Manage Orders →</Link>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  heading: { marginBottom: '1.5rem', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  icon: { fontSize: '2rem' },
  value: { fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#1a1a2e' },
  label: { color: '#888', margin: 0, fontSize: '0.9rem' },
  links: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  link: { padding: '0.75rem 1.5rem', background: '#1a1a2e', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: '600' },
}
