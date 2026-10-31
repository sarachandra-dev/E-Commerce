import { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_COLORS = {
  PENDING: '#f59e0b', PROCESSING: '#3b82f6', SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981', CANCELLED: '#ef4444',
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    orderService.getAllOrders()
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      const { data } = await orderService.updateStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? data : o))
      toast.success('Order status updated!')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <Loading />

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div style={styles.left}>
                <span style={styles.orderId}>Order #{order.id}</span>
                <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={styles.right}>
                <span style={{ ...styles.badge, background: STATUS_COLORS[order.status] }}>
                  {order.status}
                </span>
                <span style={styles.amount}>${order.totalAmount?.toFixed(2)}</span>
                <span style={styles.toggle}>{expanded === order.id ? '▲' : '▼'}</span>
              </div>
            </div>
            {expanded === order.id && (
              <div style={styles.details}>
                <p style={styles.address}><strong>Address:</strong> {order.address}</p>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Qty</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{item.productName}</td>
                        <td style={styles.td}>{item.quantity}</td>
                        <td style={styles.td}>${item.price?.toFixed(2)}</td>
                        <td style={styles.td}>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.statusUpdate}>
                  <label style={styles.statusLabel}>Update Status:</label>
                  <select style={styles.select} value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    disabled={updating === order.id}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {updating === order.id && <span style={styles.updating}>Updating...</span>}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  heading: { marginBottom: '1.5rem', color: '#1a1a2e' },
  empty: { textAlign: 'center', color: '#888', marginTop: '3rem' },
  card: { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1rem', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', cursor: 'pointer', flexWrap: 'wrap', gap: '0.5rem' },
  left: { display: 'flex', alignItems: 'center', gap: '1rem' },
  orderId: { fontWeight: '600', color: '#1a1a2e' },
  date: { color: '#888', fontSize: '0.9rem' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: '#fff', fontSize: '0.8rem', fontWeight: '600' },
  amount: { fontWeight: 'bold', color: '#1a1a2e' },
  toggle: { color: '#888' },
  details: { padding: '1rem 1.5rem', borderTop: '1px solid #eee', background: '#fafafa' },
  address: { margin: '0 0 1rem', color: '#555' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
  th: { textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #eee', color: '#888', fontSize: '0.85rem' },
  td: { padding: '0.5rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' },
  statusUpdate: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  statusLabel: { fontWeight: '600', color: '#1a1a2e' },
  select: { padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' },
  updating: { color: '#888', fontSize: '0.85rem' },
}
