import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartService } from '../services/cartService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const RATINGS = [4.1, 4.3, 4.5, 4.2, 4.6, 3.9, 4.4, 4.7, 4.0, 4.8]
const DISCOUNTS = [10, 15, 20, 25, 30, 35, 40, 45, 50]
const CAT_FALLBACK = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  'Clothing':    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
  'Books':       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
}

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [buying, setBuying] = useState(false)
  const [hovered, setHovered] = useState(false)

  const rating = RATINGS[product.id % RATINGS.length]
  const discount = DISCOUNTS[product.id % DISCOUNTS.length]
  const originalPrice = (product.price * 100 / (100 - discount)).toFixed(2)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!user) return navigate('/login')
    setAdding(true)
    try {
      await cartService.addItem({ productId: product.id, quantity: 1 })
      toast.success('Added to cart! 🛒')
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async (e) => {
    e.stopPropagation()
    if (!user) return navigate('/login')
    setBuying(true)
    try {
      await cartService.addItem({ productId: product.id, quantity: 1 })
      navigate('/cart')
    } catch {
      toast.error('Something went wrong')
      setBuying(false)
    }
  }

  return (
    <div
      style={{ ...styles.card, border: hovered ? '1px solid rgba(124,58,237,0.4)' : '1px solid #1e1e1e',
               boxShadow: hovered ? '0 8px 40px rgba(124,58,237,0.15)' : '0 2px 8px rgba(0,0,0,0.3)' }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Image */}
      <div style={styles.imgWrap}>
        <img src={product.imageUrl || CAT_FALLBACK[product.categoryName] || `https://picsum.photos/seed/${product.id}/300/300`}
          alt={product.name}
          style={{ ...styles.img, transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        <div style={styles.discountBadge}>-{discount}%</div>
        {product.stock === 0 && <div style={styles.outBadge}>Out of Stock</div>}
        {product.stock > 0 && product.stock <= 5 && <div style={styles.lowBadge}>Only {product.stock} left!</div>}
        {hovered && product.stock > 0 && (
          <div style={styles.hoverOverlay}>
            <button style={styles.quickView} onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`) }}>
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={styles.body}>
        <p style={styles.category}>{product.categoryName}</p>
        <p style={styles.name}>{product.name}</p>

        <div style={styles.ratingRow}>
          <div style={styles.stars}>
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span style={styles.ratingNum}>{rating}</span>
          <span style={styles.reviews}>({(product.id * 317 % 4500 + 200).toLocaleString()})</span>
        </div>

        <div style={styles.priceRow}>
          <span style={styles.price}>₹{Math.round(product.price * 83).toLocaleString()}</span>
          <span style={styles.originalPrice}>₹{Math.round(originalPrice * 83).toLocaleString()}</span>
        </div>
        <p style={styles.saving}>You save ₹{Math.round((originalPrice - product.price) * 83).toLocaleString()}</p>
        <p style={styles.delivery}>✅ Free Delivery</p>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button
            style={{ ...styles.addBtn, opacity: product.stock === 0 || adding ? 0.6 : 1 }}
            disabled={product.stock === 0 || adding}
            onClick={handleAddToCart}>
            {adding ? '...' : '🛒 Add to Cart'}
          </button>
          <button
            style={{ ...styles.buyBtn, opacity: product.stock === 0 || buying ? 0.6 : 1 }}
            disabled={product.stock === 0 || buying}
            onClick={handleBuyNow}>
            {buying ? '...' : '⚡ Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#111', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
    transition: 'all 0.3s ease' },
  imgWrap: { position: 'relative', overflow: 'hidden', height: '210px', background: '#1a1a1a' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' },
  discountBadge: { position: 'absolute', top: '10px', right: '10px',
    background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff',
    padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' },
  outBadge: { position: 'absolute', top: '10px', left: '10px', background: '#ef4444',
    color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' },
  lowBadge: { position: 'absolute', top: '10px', left: '10px', background: '#f59e0b',
    color: '#000', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' },
  hoverOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  quickView: { background: 'rgba(255,255,255,0.95)', color: '#0d0d0d', border: 'none',
    padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem' },
  body: { padding: '1rem' },
  category: { margin: '0 0 0.3rem', fontSize: '0.72rem', color: '#7c3aed', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.5px' },
  name: { margin: '0 0 0.6rem', fontSize: '0.88rem', color: '#e5e5e5', fontWeight: '600',
    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' },
  stars: { color: '#f59e0b', fontSize: '0.75rem', letterSpacing: '1px' },
  ratingNum: { color: '#f59e0b', fontSize: '0.78rem', fontWeight: '700' },
  reviews: { color: '#555', fontSize: '0.72rem' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.2rem' },
  price: { fontSize: '1.15rem', fontWeight: '800', color: '#fff' },
  originalPrice: { fontSize: '0.82rem', color: '#555', textDecoration: 'line-through' },
  saving: { margin: '0 0 0.2rem', fontSize: '0.75rem', color: '#4ade80', fontWeight: '600' },
  delivery: { margin: '0 0 0.9rem', fontSize: '0.75rem', color: '#4ade80' },
  actions: { display: 'flex', gap: '0.5rem' },
  addBtn: { flex: 1, padding: '0.55rem 0', background: 'rgba(124,58,237,0.15)',
    color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' },
  buyBtn: { flex: 1, padding: '0.55rem 0', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' },
}
