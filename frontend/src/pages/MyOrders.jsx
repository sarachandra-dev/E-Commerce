import { useState, useEffect } from 'react'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'

const STATUS_COLORS = {
  PENDING: '#f59e0b', PROCESSING: '#3b82f6', SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981', CANCELLED: '#ef4444',
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    orderService.getMyOrders()
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>You haven't placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div>
                <span style={styles.orderId}>Order #{order.id}</span>
                <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={styles.right}>
                <span style={{ ...styles.status, background: STATUS_COLORS[order.status] }}>
                  {order.status}
                </span>
                <span style={styles.total}>${order.totalAmount?.toFixed(2)}</span>
                <span style={styles.toggle}>{expanded === order.id ? '▲' : '▼'}</span>
              </div>
            </div>
            {expanded === order.id && (
              <div style={styles.details}>
                <p style={styles.address}><strong>Delivery:</strong> {order.address}</p>
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
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  heading: { marginBottom: '1.5rem', color: '#1a1a2e' },
  empty: { textAlign: 'center', color: '#888', marginTop: '3rem' },
  card: { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1rem', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', cursor: 'pointer', flexWrap: 'wrap', gap: '0.5rem' },
  orderId: { fontWeight: '600', color: '#1a1a2e', marginRight: '1rem' },
  date: { color: '#888', fontSize: '0.9rem' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  status: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: '#fff', fontSize: '0.8rem', fontWeight: '600' },
  total: { fontWeight: 'bold', color: '#1a1a2e' },
  toggle: { color: '#888' },
  details: { padding: '1rem 1.5rem', borderTop: '1px solid #eee', background: '#fafafa' },
  address: { margin: '0 0 1rem', color: '#555' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #eee', color: '#888', fontSize: '0.85rem' },
  td: { padding: '0.5rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' },
}
