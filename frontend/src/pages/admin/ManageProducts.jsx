import { useState, useEffect } from 'react'
import { productService } from '../../services/productService'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchData = () => {
    Promise.all([productService.getAll(), productService.getCategories()])
      .then(([pRes, cRes]) => { setProducts(pRes.data); setCategories(cRes.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openEdit = (product) => {
    setForm({
      name: product.name, description: product.description || '',
      price: product.price, stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: categories.find(c => c.name === product.categoryName)?.id || '',
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) await productService.update(editId, form)
      else await productService.create(form)
      toast.success(editId ? 'Product updated!' : 'Product created!')
      setShowForm(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      fetchData()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  if (loading) return <Loading />

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2 style={styles.heading}>Manage Products</h2>
        <button style={styles.addBtn} onClick={openCreate}>+ Add Product</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editId ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Product Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
            <textarea style={styles.textarea} placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            <div style={styles.row}>
              <input style={styles.input} type="number" placeholder="Price" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" />
              <input style={styles.input} type="number" placeholder="Stock" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
            </div>
            <input style={styles.input} placeholder="Image URL" value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <select style={styles.input} value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div style={styles.formActions}>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>
                  <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.name} style={styles.thumb} />
                </td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.categoryName}</td>
                <td style={styles.td}>${p.price?.toFixed(2)}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { margin: 0, color: '#1a1a2e' },
  addBtn: { padding: '0.6rem 1.2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  formCard: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  formTitle: { marginTop: 0, color: '#1a1a2e' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  row: { display: 'flex', gap: '1rem' },
  input: { padding: '0.65rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', flex: 1 },
  textarea: { padding: '0.65rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', resize: 'vertical' },
  formActions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  cancelBtn: { padding: '0.6rem 1.2rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  saveBtn: { padding: '0.6rem 1.2rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  thead: { background: '#1a1a2e' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', color: '#fff', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', verticalAlign: 'middle' },
  thumb: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' },
  editBtn: { padding: '0.3rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' },
  deleteBtn: { padding: '0.3rem 0.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
}
