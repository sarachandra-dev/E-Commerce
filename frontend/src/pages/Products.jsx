import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

const CAT_ICONS = { Electronics: '💻', Clothing: '👗', Books: '📚', 'Home & Kitchen': '🏠' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sort, setSort] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  // Read URL search/category params every time URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search') || ''
    const cat = params.get('category') || ''
    setSearch(q)
    setSelectedCategory(cat)
  }, [location.search])

  // Load categories once
  useEffect(() => {
    productService.getCategories().then(r => setCategories(r.data))
  }, [])

  // Fetch products whenever search / category / sort changes
  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search.trim()) params.search = search.trim()
    if (selectedCategory) params.categoryId = selectedCategory
    productService.getAll(params).then(r => {
      let data = r.data || []
      if (sort === 'low') data = [...data].sort((a, b) => a.price - b.price)
      if (sort === 'high') data = [...data].sort((a, b) => b.price - a.price)
      if (sort === 'name') data = [...data].sort((a, b) => a.name.localeCompare(b.name))
      setProducts(data)
    }).catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, selectedCategory, sort])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate(`/products?search=${search}`)
  }

  const clearSearch = () => {
    setSearch('')
    navigate('/products')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <div style={styles.filterHead}>
              <h3 style={styles.filterTitle}>Filters</h3>
              {(search || selectedCategory || sort) && (
                <button style={styles.clearBtn} onClick={() => { clearSearch(); setSelectedCategory(''); setSort('') }}>
                  Clear All
                </button>
              )}
            </div>
            <div style={styles.divider} />

            <p style={styles.filterLabel}>CATEGORIES</p>
            <div style={styles.filterList}>
              <label style={styles.filterItem}>
                <input type="radio" name="cat" checked={!selectedCategory}
                  onChange={() => setSelectedCategory('')} style={styles.radio} />
                <span style={styles.filterText}>All Categories</span>
              </label>
              {categories.map(c => (
                <label key={c.id} style={styles.filterItem}>
                  <input type="radio" name="cat" checked={selectedCategory == c.id}
                    onChange={() => setSelectedCategory(c.id)} style={styles.radio} />
                  <span style={styles.filterText}>{CAT_ICONS[c.name] || '📦'} {c.name}</span>
                </label>
              ))}
            </div>

            <div style={styles.divider} />
            <p style={styles.filterLabel}>SORT BY</p>
            <div style={styles.filterList}>
              {[
                { val: '', label: '⭐ Relevance' },
                { val: 'low', label: '↑ Price: Low to High' },
                { val: 'high', label: '↓ Price: High to Low' },
                { val: 'name', label: '🔤 Name: A to Z' },
              ].map(s => (
                <label key={s.val} style={styles.filterItem}>
                  <input type="radio" name="sort" checked={sort === s.val}
                    onChange={() => setSort(s.val)} style={styles.radio} />
                  <span style={styles.filterText}>{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>

          {/* Top Search Bar */}
          <form onSubmit={handleSearchSubmit} style={styles.topBar}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>🔍</span>
              <input style={styles.searchInput}
                placeholder="Search products, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)} />
              {search && (
                <button type="button" style={styles.clearX} onClick={clearSearch}>✕</button>
              )}
            </div>
            <button type="submit" style={styles.searchBtn}>Search</button>
            <span style={styles.resultCount}>
              {!loading && `${products.length} product${products.length !== 1 ? 's' : ''} found`}
            </span>
          </form>

          {/* Active Filter Tags */}
          {(search || selectedCategory) && (
            <div style={styles.activeTags}>
              {search && (
                <div style={styles.tag}>
                  🔍 "{search}"
                  <button style={styles.tagX} onClick={clearSearch}>✕</button>
                </div>
              )}
              {selectedCategory && (
                <div style={styles.tag}>
                  📂 {categories.find(c => c.id == selectedCategory)?.name}
                  <button style={styles.tagX} onClick={() => setSelectedCategory('')}>✕</button>
                </div>
              )}
            </div>
          )}

          {/* Products */}
          {loading ? <Loading /> : (
            products.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🔍</div>
                <h3 style={styles.emptyTitle}>No products found</h3>
                <p style={styles.emptySub}>
                  {search ? `No results for "${search}". Try a different keyword.` : 'No products in this category yet.'}
                </p>
                <button style={styles.browseBtn} onClick={clearSearch}>Browse All Products</button>
              </div>
            ) : (
              <div style={styles.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0d0d0d', minHeight: '100vh', padding: '1.5rem 0' },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  sidebar: { width: '220px', flexShrink: 0, position: 'sticky', top: '90px' },
  sidebarCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '1.2rem' },
  filterHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  filterTitle: { color: '#fff', fontSize: '1rem', fontWeight: '800', margin: 0 },
  clearBtn: { background: 'none', border: 'none', color: '#7c3aed', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '600' },
  divider: { borderTop: '1px solid #1e1e1e', margin: '0.75rem 0' },
  filterLabel: { color: '#555', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 0.6rem' },
  filterList: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' },
  filterItem: { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' },
  filterText: { color: '#aaa', fontSize: '0.85rem' },
  radio: { accentColor: '#7c3aed', cursor: 'pointer', width: '14px', height: '14px' },
  main: { flex: 1, minWidth: 0 },
  topBar: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#111',
    border: '1px solid #1e1e1e', borderRadius: '14px', padding: '0.75rem 1rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchWrap: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' },
  searchIcon: { fontSize: '1rem', opacity: 0.5, flexShrink: 0 },
  searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', padding: '0.2rem 0' },
  clearX: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.3rem' },
  searchBtn: { background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none',
    padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 },
  resultCount: { color: '#555', fontSize: '0.82rem', whiteSpace: 'nowrap' },
  activeTags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  tag: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', padding: '0.3rem 0.75rem',
    borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600' },
  tagX: { background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.75rem', padding: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' },
  empty: { textAlign: 'center', padding: '5rem 2rem', background: '#111', borderRadius: '16px', border: '1px solid #1e1e1e' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { color: '#fff', fontSize: '1.3rem', fontWeight: '800', margin: '0 0 0.5rem' },
  emptySub: { color: '#666', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  browseBtn: { padding: '0.7rem 1.8rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)',
    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
}
