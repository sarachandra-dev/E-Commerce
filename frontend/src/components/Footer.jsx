import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.top}>
        <div style={styles.container}>
          <div style={styles.grid}>
            <div>
              <h4 style={styles.colTitle}>ABOUT</h4>
              <div style={styles.links}>
                <span style={styles.link}>Contact Us</span>
                <span style={styles.link}>About Us</span>
                <span style={styles.link}>Careers</span>
                <span style={styles.link}>Press</span>
                <span style={styles.link}>Corporate Information</span>
              </div>
            </div>
            <div>
              <h4 style={styles.colTitle}>HELP</h4>
              <div style={styles.links}>
                <span style={styles.link}>Payments</span>
                <span style={styles.link}>Shipping</span>
                <span style={styles.link}>Cancellation & Returns</span>
                <span style={styles.link}>FAQ</span>
                <span style={styles.link}>Report Infringement</span>
              </div>
            </div>
            <div>
              <h4 style={styles.colTitle}>POLICY</h4>
              <div style={styles.links}>
                <span style={styles.link}>Return Policy</span>
                <span style={styles.link}>Terms of Use</span>
                <span style={styles.link}>Security</span>
                <span style={styles.link}>Privacy</span>
                <span style={styles.link}>Sitemap</span>
              </div>
            </div>
            <div>
              <h4 style={styles.colTitle}>QUICK LINKS</h4>
              <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/products" style={styles.link}>Products</Link>
                <Link to="/cart" style={styles.link}>Cart</Link>
                <Link to="/orders" style={styles.link}>My Orders</Link>
                <Link to="/register" style={styles.link}>Register</Link>
              </div>
            </div>
            <div>
              <h4 style={styles.colTitle}>MAIL US</h4>
              <p style={styles.address}>
                ShopSphere Internet Pvt. Ltd.,<br />
                Buildings Alyssa, Begonia &<br />
                Clove Embassy Tech Village,<br />
                Outer Ring Road, Devarabeesanahalli,<br />
                Bengaluru, 560103, Karnataka, India
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.bottomInner}>
          <div style={styles.bottomLeft}>
            <span style={styles.bottomItem}>🛡️ Become a Seller</span>
            <span style={styles.sep}>|</span>
            <span style={styles.bottomItem}>📣 Advertise</span>
            <span style={styles.sep}>|</span>
            <span style={styles.bottomItem}>🎁 Gift Cards</span>
            <span style={styles.sep}>|</span>
            <span style={styles.bottomItem}>❓ Help Center</span>
          </div>
          <div style={styles.bottomRight}>
            <span style={styles.copyright}>© {new Date().getFullYear()} ShopSphere.com</span>
            <div style={styles.payIcons}>
              <span style={styles.payIcon}>💳 Visa</span>
              <span style={styles.payIcon}>🏦 NetBanking</span>
              <span style={styles.payIcon}>📱 UPI</span>
              <span style={styles.payIcon}>💰 COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: { background: '#172337', marginTop: '2rem' },
  top: { padding: '3rem 0 2rem' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' },
  colTitle: { color: '#878787', fontSize: '0.78rem', fontWeight: '700', margin: '0 0 1rem', letterSpacing: '0.5px' },
  links: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  link: { color: '#fff', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none' },
  address: { color: '#fff', fontSize: '0.82rem', lineHeight: 1.8, margin: 0 },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' },
  bottomInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
                 display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  bottomLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  bottomItem: { color: '#fff', fontSize: '0.82rem', cursor: 'pointer' },
  sep: { color: '#878787' },
  bottomRight: { display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' },
  copyright: { color: '#878787', fontSize: '0.82rem' },
  payIcons: { display: 'flex', gap: '0.75rem' },
  payIcon: { background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.3rem 0.6rem',
             borderRadius: '4px', fontSize: '0.75rem' },
}
