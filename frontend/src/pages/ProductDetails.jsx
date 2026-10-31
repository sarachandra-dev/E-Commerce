import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { cartService } from '../services/cartService'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    productService.getById(id)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const addToCart = async () => {
    if (!user) return navigate('/login')
    try {
      await cartService.addItem({ productId: product.id, quantity })
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) return <Loading />
  if (!product) return null

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.card}>
        <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} style={styles.img} />
        <div style={styles.info}>
          <p style={styles.category}>{product.categoryName}</p>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>${product.price?.toFixed(2)}</p>
          <p style={styles.desc}>{product.description}</p>
          <p style={styles.stock}>
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </p>
          {product.stock > 0 && (
            <div style={styles.actions}>
              <div style={styles.qty}>
                <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={styles.qtyNum}>{quantity}</span>
                <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button style={styles.addBtn} onClick={addToCart}>Add to Cart</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  back: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '1rem', marginBottom: '1.5rem' },
  card: { display: 'flex', gap: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', flexWrap: 'wrap' },
  img: { width: '400px', maxWidth: '100%', objectFit: 'cover' },
  info: { flex: 1, padding: '2rem', minWidth: '250px' },
  category: { color: '#888', fontSize: '0.9rem', margin: '0 0 0.5rem' },
  name: { fontSize: '1.8rem', margin: '0 0 0.5rem', color: '#1a1a2e' },
  price: { fontSize: '1.5rem', color: '#e94560', fontWeight: 'bold', margin: '0 0 1rem' },
  desc: { color: '#555', lineHeight: '1.6', margin: '0 0 1rem' },
  stock: { margin: '0 0 1.5rem', fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  qty: { display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', padding: '0.3rem 0.75rem' },
  qtyBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#1a1a2e' },
  qtyNum: { fontSize: '1rem', minWidth: '20px', textAlign: 'center' },
  addBtn: { padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
}
