import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartService } from '../services/cartService'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

export default function Checkout() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', address: '', city: '', state: '' })
  const navigate = useNavigate()

  useEffect(() => {
    cartService.getCart().then(r => {
      if (!r.data.items?.length) navigate('/cart')
      else setCart(r.data)
    }).finally(() => setLoading(false))
  }, [])

  const placeOrder = async (e) => {
    e.preventDefault()
    const fullAddress = `${form.name}, ${form.phone}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
    setPlacing(true)
    try {
      await orderService.placeOrder({ address: fullAddress })
      toast.success('🎉 Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <Loading />

  const discount = Math.round((cart?.total || 0) * 83 * 0.1)
  const delivery = (cart?.total || 0) > 6000 ? 0 : 99
  const total = Math.round((cart?.total || 0) * 83) - discount + delivery

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Steps */}
        <div style={styles.steps}>
          {['Cart', 'Address', 'Payment'].map((s, i) => (
            <div key={s} style={styles.stepItem}>
              <div style={{ ...styles.stepCircle, background: i + 1 <= step ? 'linear-gradient(135deg,#7c3aed,#db2777)' : '#1e1e1e',
                color: i + 1 <= step ? '#fff' : '#555' }}>{i + 1}</div>
              <span style={{ ...styles.stepLabel, color: i + 1 <= step ? '#fff' : '#555' }}>{s}</span>
              {i < 2 && <div style={{ ...styles.stepLine, background: i + 1 < step ? '#7c3aed' : '#1e1e1e' }} />}
            </div>
          ))}
        </div>

        <div style={styles.layout}>
          {/* Form */}
          <div style={styles.formCol}>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>📍 Delivery Address</h2>
              <form onSubmit={placeOrder} style={styles.form}>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Full Name *</label>
                    <input style={styles.input} placeholder="Enter your full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone Number *</label>
                    <input style={styles.input} placeholder="10-digit mobile number"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Full Address *</label>
                  <textarea style={styles.textarea} rows={3} placeholder="House No., Building, Street, Area..."
                    value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>City *</label>
                    <input style={styles.input} placeholder="City"
                      value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>State *</label>
                    <input style={styles.input} placeholder="State"
                      value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Pincode *</label>
                    <input style={styles.input} placeholder="6-digit pincode"
                      value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                  </div>
                </div>

                <div style={styles.paymentSection}>
                  <h3 style={styles.payTitle}>💳 Payment Method</h3>
                  <div style={styles.payOptions}>
                    {['Cash on Delivery', 'UPI Payment', 'Credit / Debit Card', 'Net Banking'].map(p => (
                      <label key={p} style={styles.payOption}>
                        <input type="radio" name="payment" defaultChecked={p === 'Cash on Delivery'} style={styles.radio} />
                        <span style={styles.payLabel}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" style={styles.placeBtn} disabled={placing}>
                  {placing ? '⏳ Placing Order...' : `🎉 Place Order — ₹${total.toLocaleString()}`}
                </button>
                <p style={styles.safeNote}>🔒 Your payment information is encrypted and secure</p>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div style={styles.summaryCol}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.itemsList}>
                {cart?.items?.map(item => (
                  <div key={item.id} style={styles.summaryItem}>
                    <img src={item.imageUrl || `https://picsum.photos/seed/${item.productId}/60/60`}
                      alt={item.productName} style={styles.summaryImg} />
                    <div style={styles.summaryItemInfo}>
                      <p style={styles.summaryItemName}>{item.productName}</p>
                      <p style={styles.summaryItemQty}>Qty: {item.quantity}</p>
                    </div>
                    <span style={styles.summaryItemPrice}>₹{Math.round(item.price * 83 * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={styles.divider} />
              <div style={styles.priceRows}>
                <div style={styles.priceRow}><span>Subtotal</span><span>₹{Math.round((cart?.total || 0) * 83).toLocaleString()}</span></div>
                <div style={styles.priceRow}><span>Discount</span><span style={styles.green}>− ₹{discount.toLocaleString()}</span></div>
                <div style={styles.priceRow}><span>Delivery</span><span style={styles.green}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
              </div>
              <div style={styles.divider} />
              <div style={styles.totalRow}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <p style={styles.savingMsg}>🎉 You save ₹{discount.toLocaleString()} on this order!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0d0d0d', minHeight: '100vh', padding: '2rem 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', gap: '0' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' },
  stepLabel: { fontSize: '0.85rem', fontWeight: '600', marginRight: '0.5rem' },
  stepLine: { width: '60px', height: '2px', marginRight: '0.5rem' },
  layout: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  formCol: { flex: 1, minWidth: '300px' },
  formCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '2rem' },
  formTitle: { color: '#fff', fontSize: '1.3rem', fontWeight: '800', margin: '0 0 1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '140px' },
  label: { color: '#888', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '0.75rem 1rem',
    color: '#fff', fontSize: '0.9rem', outline: 'none' },
  textarea: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '0.75rem 1rem',
    color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical' },
  paymentSection: { background: '#0d0d0d', borderRadius: '12px', padding: '1.2rem', border: '1px solid #1e1e1e' },
  payTitle: { color: '#fff', margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700' },
  payOptions: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  payOption: { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' },
  radio: { accentColor: '#7c3aed', width: '16px', height: '16px', cursor: 'pointer' },
  payLabel: { color: '#ccc', fontSize: '0.9rem' },
  placeBtn: { padding: '1.1rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.05rem', cursor: 'pointer',
    fontWeight: '800', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' },
  safeNote: { textAlign: 'center', color: '#555', fontSize: '0.78rem', margin: 0 },
  summaryCol: { width: '320px', flexShrink: 0 },
  summaryCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '1.5rem', position: 'sticky', top: '100px' },
  summaryTitle: { color: '#888', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px',
    textTransform: 'uppercase', margin: '0 0 1.2rem' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  summaryImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', background: '#1a1a1a' },
  summaryItemInfo: { flex: 1 },
  summaryItemName: { margin: 0, color: '#e5e5e5', fontSize: '0.82rem', fontWeight: '600',
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  summaryItemQty: { margin: 0, color: '#666', fontSize: '0.75rem' },
  summaryItemPrice: { color: '#fff', fontWeight: '700', fontSize: '0.88rem', flexShrink: 0 },
  divider: { borderTop: '1px solid #1e1e1e', margin: '1rem 0' },
  priceRows: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  priceRow: { display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.88rem' },
  green: { color: '#4ade80', fontWeight: '600' },
  totalRow: { display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem' },
  savingMsg: { color: '#4ade80', fontSize: '0.8rem', margin: 0, fontWeight: '600' },
}
