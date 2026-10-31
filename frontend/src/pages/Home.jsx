import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

const CATEGORIES = [
  { id: 1, name: 'Smartphones', search: 'phone', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', tag: 'Up to 40% OFF' },
  { id: 2, name: 'Laptops', search: 'laptop', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', tag: 'From ₹29,999' },
  { id: 3, name: 'Headphones', search: 'headphone', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', tag: 'Best Sellers' },
  { id: 4, name: 'Cameras', search: 'camera', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', tag: 'New Arrivals' },
  { id: 5, name: 'Men Fashion', search: 'polo', img: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', tag: 'Trending Now' },
  { id: 6, name: 'Women Fashion', search: 'dress', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', tag: 'Min 50% OFF' },
  { id: 7, name: 'Sneakers', search: 'nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', tag: 'Hot Deals' },
  { id: 8, name: 'Books', search: 'book', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', tag: 'Top Rated' },
  { id: 9, name: 'Kitchen', search: 'kitchen', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#d4fc79,#96e6a1)', tag: 'Home Essentials' },
  { id: 10, name: 'Watches', search: 'watch', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop', gradient: 'linear-gradient(135deg,#f6d365,#fda085)', tag: 'Premium Picks' },
]

const SLIDES = [
  { bg: 'linear-gradient(120deg,#0f0c29,#302b63,#24243e)', title: 'Next-Gen', accent: 'Electronics', sub: 'iPhone 15 Pro · MacBook Pro · Sony XM5', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop', search: 'iphone' },
  { bg: 'linear-gradient(120deg,#1a0533,#6a0572,#ab0f7a)', title: 'Style That', accent: 'Speaks', sub: 'Trending Fashion · Sneakers · Accessories', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop', search: 'dress' },
  { bg: 'linear-gradient(120deg,#003d2b,#006b4f,#00a878)', title: 'Transform Your', accent: 'Home', sub: 'Kitchen · Decor · Smart Appliances', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop', search: 'kitchen' },
]

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [hoveredCat, setHoveredCat] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    productService.getAll().then(r => setProducts(r.data)).finally(() => setLoading(false))
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const goToCategory = (search) => navigate(`/products?search=${search}`)
  const s = SLIDES[slide]

  return (
    <div style={styles.page}>

      {/* Announcement Bar */}
      <div style={styles.announcementBar}>
        <span>⚡ FLASH SALE — Extra 15% off with code <b>SPHERE15</b></span>
        <span style={styles.annSep}>|</span>
        <span>🚚 Free delivery on orders above ₹499</span>
        <span style={styles.annSep}>|</span>
        <span>🔄 Easy 30-day returns</span>
      </div>

      {/* Hero Slider */}
      <div style={{ ...styles.hero, background: s.bg }}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div style={styles.heroPill}>🔥 Limited Time Offer</div>
          <h1 style={styles.heroH1}>
            {s.title}<br />
            <span style={styles.heroAccent}>{s.accent}</span>
          </h1>
          <p style={styles.heroSub}>{s.sub}</p>
          <div style={styles.heroBtns}>
            <button style={styles.heroPrimary} onClick={() => goToCategory(s.search)}>Shop Now →</button>
            <button style={styles.heroSecondary} onClick={() => navigate('/products')}>View All</button>
          </div>
        </div>
        <div style={styles.heroImgWrap}>
          <div style={styles.heroImgGlow} />
          <img src={s.img} alt="hero" style={styles.heroImg} />
        </div>
        <div style={styles.slideDots}>
          {SLIDES.map((_, i) => (
            <button key={i} style={{ ...styles.dot, width: i === slide ? '28px' : '8px', background: i === slide ? '#fff' : 'rgba(255,255,255,0.35)' }}
              onClick={() => { setSlide(i); clearInterval(timerRef.current) }} />
          ))}
        </div>
      </div>

      {/* Trust Bar */}
      <div style={styles.trustBar}>
        {[
          { icon: '🚚', t: 'Free Delivery', s: 'Orders above ₹499' },
          { icon: '🔒', t: 'Secure Payments', s: '100% safe & encrypted' },
          { icon: '↩️', t: '30-Day Returns', s: 'Hassle-free returns' },
          { icon: '⭐', t: '4.9 Rated', s: '50K+ happy customers' },
          { icon: '🎧', t: '24/7 Support', s: 'Always here for you' },
        ].map(f => (
          <div key={f.t} style={styles.trustItem}>
            <span style={styles.trustIcon}>{f.icon}</span>
            <div>
              <p style={styles.trustTitle}>{f.t}</p>
              <p style={styles.trustSub}>{f.s}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <p style={styles.sectionEye}>EXPLORE</p>
            <h2 style={styles.sectionTitle}>Shop by Category</h2>
          </div>
          <button style={styles.viewAllBtn} onClick={() => navigate('/products')}>View All →</button>
        </div>
        <div style={styles.catGrid}>
          {CATEGORIES.map(cat => (
            <div key={cat.id}
              style={{ ...styles.catCard, transform: hoveredCat === cat.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)' }}
              onClick={() => goToCategory(cat.search)}
              onMouseEnter={() => setHoveredCat(cat.id)}
              onMouseLeave={() => setHoveredCat(null)}>
              <div style={{ ...styles.catImgWrap, background: cat.gradient }}>
                <img src={cat.img} alt={cat.name} style={styles.catImg} />
                <div style={styles.catTag}>{cat.tag}</div>
              </div>
              <div style={styles.catInfo}>
                <p style={styles.catName}>{cat.name}</p>
                <p style={styles.catShop}>Shop Now →</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Promo Banners */}
      <div style={styles.section}>
        <div style={styles.dualBanner}>
          <div style={styles.promoBig} onClick={() => goToCategory('iphone')}>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=350&fit=crop" alt="mobile" style={styles.promoBigImg} />
            <div style={styles.promoBigOverlay}>
              <span style={styles.promoBigTag}>📱 MOBILES</span>
              <h3 style={styles.promoBigTitle}>Latest Smartphones</h3>
              <p style={styles.promoBigSub}>Up to 40% OFF · Free Delivery</p>
              <button style={styles.promoBigBtn}>Shop Now</button>
            </div>
          </div>
          <div style={styles.promoSmalls}>
            <div style={styles.promoSmall} onClick={() => goToCategory('dress')}>
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop" alt="fashion" style={styles.promoSmallImg} />
              <div style={styles.promoSmallOverlay}>
                <span style={styles.promoSmallTag}>👗 FASHION</span>
                <p style={styles.promoSmallTitle}>Min 50% OFF</p>
              </div>
            </div>
            <div style={styles.promoSmall} onClick={() => goToCategory('laptop')}>
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop" alt="laptops" style={styles.promoSmallImg} />
              <div style={styles.promoSmallOverlay}>
                <span style={styles.promoSmallTag}>💻 LAPTOPS</span>
                <p style={styles.promoSmallTitle}>From ₹29,999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Deals */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <p style={styles.sectionEye}>TODAY ONLY</p>
            <h2 style={styles.sectionTitle}>🔥 Top Deals</h2>
          </div>
          <button style={styles.viewAllBtn} onClick={() => navigate('/products')}>View All →</button>
        </div>
        {loading ? <Loading /> : (
          <div style={styles.productsGrid}>
            {products.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Offer Banner */}
      <div style={styles.offerBanner}>
        <div style={styles.offerLeft}>
          <p style={styles.offerEye}>EXCLUSIVE DEAL</p>
          <h2 style={styles.offerTitle}>Get 20% OFF<br />Your First Order</h2>
          <p style={styles.offerSub}>Use code <span style={styles.offerCode}>WELCOME20</span> at checkout</p>
          <button style={styles.offerBtn} onClick={() => navigate('/register')}>Create Account & Save 🎁</button>
        </div>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=450&h=280&fit=crop"
          alt="offer" style={styles.offerImg} />
      </div>

      {/* More Products */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <div>
            <p style={styles.sectionEye}>HANDPICKED</p>
            <h2 style={styles.sectionTitle}>📚 Books & Lifestyle</h2>
          </div>
          <button style={styles.viewAllBtn} onClick={() => navigate('/products')}>View All →</button>
        </div>
        {loading ? <Loading /> : (
          <div style={styles.productsGrid}>
            {products.slice(14, 20).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  page: { background: '#0d0d0d', minHeight: '100vh', color: '#fff' },
  announcementBar: { background: 'linear-gradient(90deg,#7c3aed,#db2777,#ea580c)', color: '#fff',
    textAlign: 'center', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: '500',
    display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' },
  annSep: { opacity: 0.5 },
  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '4rem 5rem', minHeight: '500px', position: 'relative', overflow: 'hidden',
    transition: 'background 0.8s ease' },
  heroGlow: { position: 'absolute', top: '-100px', right: '200px', width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', pointerEvents: 'none' },
  heroContent: { flex: 1, zIndex: 2 },
  heroPill: { display: 'inline-block', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 1.2rem',
    borderRadius: '50px', fontSize: '0.82rem', marginBottom: '1.5rem', fontWeight: '600' },
  heroH1: { fontSize: '4.5rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem', lineHeight: 1.05 },
  heroAccent: { background: 'linear-gradient(90deg,#a78bfa,#f472b6,#fb923c)', WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: '0 0 2.5rem' },
  heroBtns: { display: 'flex', gap: '1rem' },
  heroPrimary: { padding: '0.9rem 2.2rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1rem', cursor: 'pointer',
    fontWeight: '700', boxShadow: '0 8px 30px rgba(124,58,237,0.5)' },
  heroSecondary: { padding: '0.9rem 2.2rem', background: 'rgba(255,255,255,0.08)',
    color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px',
    fontSize: '1rem', cursor: 'pointer', fontWeight: '600', backdropFilter: 'blur(10px)' },
  heroImgWrap: { flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 },
  heroImgGlow: { position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)', borderRadius: '50%' },
  heroImg: { width: '460px', height: '320px', objectFit: 'cover', borderRadius: '24px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' },
  slideDots: { position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', gap: '0.5rem', alignItems: 'center' },
  dot: { height: '8px', borderRadius: '50px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 },
  trustBar: { background: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222',
    display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '1.2rem 2rem', gap: '0.5rem' },
  trustItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' },
  trustIcon: { fontSize: '1.8rem' },
  trustTitle: { margin: 0, fontWeight: '700', color: '#fff', fontSize: '0.85rem' },
  trustSub: { margin: 0, color: '#666', fontSize: '0.75rem' },
  section: { maxWidth: '1300px', margin: '0 auto', padding: '3rem 2rem' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' },
  sectionEye: { color: '#7c3aed', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', margin: '0 0 0.3rem' },
  sectionTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: 0 },
  viewAllBtn: { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)',
    padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.2rem' },
  catCard: { borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', background: '#1a1a1a',
    border: '1px solid #222', transition: 'all 0.3s ease' },
  catImgWrap: { position: 'relative', height: '160px', overflow: 'hidden' },
  catImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' },
  catTag: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)', color: '#fff', padding: '0.25rem 0.6rem',
    borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)' },
  catInfo: { padding: '0.9rem 1rem' },
  catName: { margin: '0 0 0.2rem', fontWeight: '700', color: '#fff', fontSize: '0.9rem' },
  catShop: { margin: 0, color: '#7c3aed', fontSize: '0.78rem', fontWeight: '600' },
  dualBanner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' },
  promoBig: { position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', height: '380px' },
  promoBigImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' },
  promoBigOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem' },
  promoBigTag: { background: 'rgba(124,58,237,0.8)', color: '#fff', padding: '0.3rem 0.8rem',
    borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', width: 'fit-content', marginBottom: '0.75rem' },
  promoBigTitle: { color: '#fff', fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.4rem' },
  promoBigSub: { color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: '0 0 1rem' },
  promoBigBtn: { background: '#fff', color: '#0d0d0d', border: 'none', padding: '0.6rem 1.5rem',
    borderRadius: '8px', fontWeight: '700', cursor: 'pointer', width: 'fit-content', fontSize: '0.9rem' },
  promoSmalls: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  promoSmall: { position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', flex: 1 },
  promoSmallImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  promoSmallOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' },
  promoSmallTag: { background: 'rgba(219,39,119,0.8)', color: '#fff', padding: '0.2rem 0.6rem',
    borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', width: 'fit-content', marginBottom: '0.4rem' },
  promoSmallTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: '800', margin: 0 },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' },
  offerBanner: { background: 'linear-gradient(135deg,#1a0533,#3b0764,#6d28d9)', margin: '0 auto 0',
    maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '4rem 6rem', overflow: 'hidden', position: 'relative' },
  offerLeft: { color: '#fff', zIndex: 1 },
  offerEye: { color: '#c4b5fd', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', margin: '0 0 0.5rem' },
  offerTitle: { fontSize: '3rem', fontWeight: '900', margin: '0 0 1rem', lineHeight: 1.1 },
  offerSub: { fontSize: '1rem', margin: '0 0 2rem', color: 'rgba(255,255,255,0.8)' },
  offerCode: { background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.8rem', borderRadius: '6px',
    fontWeight: '800', color: '#fde68a', letterSpacing: '1px' },
  offerBtn: { padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1rem', cursor: 'pointer',
    fontWeight: '800', boxShadow: '0 8px 30px rgba(245,158,11,0.4)' },
  offerImg: { width: '380px', height: '260px', objectFit: 'cover', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' },
}
