import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartService } from '../services/cartService'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCart = () => {
    cartService.getCart().then(r => setCart(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const updateQty = async (itemId, quantity) => {
    try {
      const { data } = await cartService.updateItem(itemId, quantity)
      setCart(data)
    } catch { toast.error('Failed to update') }
  }

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId)
      fetchCart()
      toast.success('Item removed')
    } catch { toast.error('Failed to remove') }
  }

  if (loading) return <Loading />

  const items = cart?.items || []
  const discount = Math.round((cart?.total || 0) * 83 * 0.1)
  const delivery = (cart?.total || 0) > 6000 ? 0 : 99
  const total = Math.round((cart?.total || 0) * 83) - discount + delivery

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🛒 My Cart <span style={styles.count}>({items.length} items)</span></h1>

        {items.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptySub}>Looks like you haven't added anything yet</p>
            <button style={styles.shopBtn} onClick={() => navigate('/products')}>Start Shopping →</button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Items */}
            <div style={styles.itemsCol}>
              {items.map(item => (
                <div key={item.id} style={styles.itemCard}>
                  <img src={item.imageUrl || `https://picsum.photos/seed/${item.productId}/120/120`}
                    alt={item.productName} style={styles.itemImg} />
                  <div style={styles.itemDetails}>
                    <p style={styles.itemName}>{item.productName}</p>
                    <p style={styles.itemCategory}>In Stock ✅</p>
                    <div style={styles.itemPriceRow}>
                      <span style={styles.itemPrice}>₹{Math.round(item.price * 83).toLocaleString()}</span>
                      <span style={styles.itemOriginal}>₹{Math.round(item.price * 83 * 1.2).toLocaleString()}</span>
                      <span style={styles.itemSaving}>20% off</span>
                    </div>
                    <p style={styles.freeDelivery}>✅ Free Delivery</p>
                    <div style={styles.itemActions}>
                      <div style={styles.qtyWrap}>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                        <span style={styles.qtyNum}>{item.quantity}</span>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>🗑 Remove</button>
                      <button style={styles.wishBtn}>♡ Wishlist</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={styles.summaryCol}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Price Details</h3>
                <div style={styles.summaryRows}>
                  <div style={styles.summaryRow}>
                    <span>Price ({items.length} items)</span>
                    <span>₹{Math.round((cart?.total || 0) * 83).toLocaleString()}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Discount</span>
                    <span style={styles.green}>− ₹{discount.toLocaleString()}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery Charges</span>
                    <span style={styles.green}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.totalRow}>
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <p style={styles.savingMsg}>🎉 You will save ₹{discount.toLocaleString()} on this order</p>
                <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                  Place Order →
                </button>
                <div style={styles.safeTag}>🔒 Safe and Secure Payments</div>
              </div>

              {/* Offers */}
              <div style={styles.offersCard}>
                <h4 style={styles.offersTitle}>🏷️ Available Offers</h4>
                {['10% off on HDFC Bank Cards', 'Extra 5% off with ShopSphere Pay', 'No Cost EMI on orders above ₹3000'].map(o => (
                  <div key={o} style={styles.offerItem}>
                    <span style={styles.offerDot}>✦</span>
                    <span style={styles.offerText}>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0d0d0d', minHeight: '100vh', padding: '2rem 0' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' },
  heading: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' },
  count: { color: '#666', fontSize: '1.2rem', fontWeight: '400' },
  empty: { textAlign: 'center', padding: '6rem 2rem' },
  emptyIcon: { fontSize: '5rem', marginBottom: '1.5rem' },
  emptyTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.75rem' },
  emptySub: { color: '#666', fontSize: '1rem', margin: '0 0 2rem' },
  shopBtn: { padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  layout: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  itemsCol: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  itemCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px',
    padding: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  itemImg: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', background: '#1a1a1a' },
  itemDetails: { flex: 1, minWidth: '200px' },
  itemName: { margin: '0 0 0.3rem', color: '#e5e5e5', fontWeight: '600', fontSize: '1rem' },
  itemCategory: { margin: '0 0 0.6rem', color: '#4ade80', fontSize: '0.8rem' },
  itemPriceRow: { display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.3rem' },
  itemPrice: { color: '#fff', fontWeight: '800', fontSize: '1.2rem' },
  itemOriginal: { color: '#555', textDecoration: 'line-through', fontSize: '0.85rem' },
  itemSaving: { color: '#4ade80', fontSize: '0.82rem', fontWeight: '600' },
  freeDelivery: { margin: '0 0 1rem', color: '#4ade80', fontSize: '0.8rem' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  qtyWrap: { display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' },
  qtyBtn: { background: '#1a1a1a', color: '#fff', border: 'none', width: '34px', height: '34px',
    cursor: 'pointer', fontSize: '1.1rem', fontWeight: '700' },
  qtyNum: { color: '#fff', fontWeight: '700', padding: '0 1rem', fontSize: '0.9rem' },
  removeBtn: { background: 'none', border: '1px solid #2a2a2a', color: '#f87171', padding: '0.4rem 0.9rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' },
  wishBtn: { background: 'none', border: '1px solid #2a2a2a', color: '#a78bfa', padding: '0.4rem 0.9rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' },
  summaryCol: { width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' },
  summaryCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '1.5rem' },
  summaryTitle: { color: '#888', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '1px',
    textTransform: 'uppercase', margin: '0 0 1.2rem', paddingBottom: '1rem', borderBottom: '1px solid #1e1e1e' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9rem' },
  green: { color: '#4ade80', fontWeight: '600' },
  summaryDivider: { borderTop: '1px solid #1e1e1e', margin: '1rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem' },
  savingMsg: { color: '#4ade80', fontSize: '0.82rem', margin: '0 0 1.5rem', fontWeight: '600' },
  checkoutBtn: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer',
    fontWeight: '800', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(124,58,237,0.4)' },
  safeTag: { textAlign: 'center', color: '#555', fontSize: '0.78rem' },
  offersCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '1.2rem' },
  offersTitle: { color: '#fff', margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: '700' },
  offerItem: { display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' },
  offerDot: { color: '#7c3aed', fontSize: '0.7rem', marginTop: '2px', flexShrink: 0 },
  offerText: { color: '#888', fontSize: '0.82rem', lineHeight: 1.4 },
}
