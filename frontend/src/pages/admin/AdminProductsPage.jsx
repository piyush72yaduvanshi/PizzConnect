import { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { productName: '', price: '', description: '', category: 'veg', stock: '' };

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    productAPI.getAll().then(r => setProducts(r.data.products || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ productName: p.productName, price: p.price, description: p.description, category: p.category, stock: p.stock });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await productAPI.update(editing, form);
        toast.success('Product updated!');
      } else {
        await productAPI.upload(form);
        toast.success('Product added!');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (id) => {
    try {
      await productAPI.toggleAvailability(id);
      load();
    } catch { toast.error('Toggle failed'); }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>🍕 Manage Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{products.length} active products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Product</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Available</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 500, textTransform: 'capitalize' }}>{p.productName}</td>
                <td><span className={`badge badge-${p.category === 'veg' ? 'veg' : 'nonveg'}`}>{p.category}</span></td>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleToggle(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.isAvailable ? 'var(--success)' : 'var(--text-dim)' }}>
                    {p.isAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Pencil size={13}/></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 6 }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Product Name</label>
                <input className="input" value={form.productName} onChange={e => setForm(f=>({...f, productName: e.target.value}))} required placeholder="Margherita Pizza" />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Price (₹)</label>
                  <input className="input" type="number" min="0" value={form.price} onChange={e => setForm(f=>({...f, price: e.target.value}))} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Stock</label>
                  <input className="input" type="number" min="0" value={form.stock} onChange={e => setForm(f=>({...f, stock: e.target.value}))} required />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(f=>({...f, category: e.target.value}))}>
                  <option value="veg">🌿 Veg</option>
                  <option value="non-veg">🍖 Non-Veg</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm(f=>({...f, description: e.target.value}))} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner spinner-sm" /> : (editing ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
