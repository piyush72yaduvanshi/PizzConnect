import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const { cart, fetchCart, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India'
  });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cartAPI.checkout(form);
      setCart(null);
      navigate('/order-success', { state: { order: res.data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  if (!cart || cart.products?.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>📦 Checkout</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>One last step — fill in your delivery details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
        {/* Address Form */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <MapPin size={20} color="var(--primary)" />
            <h3>Delivery Address</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input" placeholder="John Doe" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input className="input" placeholder="+91 98765..." value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Street Address</label>
              <input className="input" placeholder="123 Main Street, Apt 4B" value={form.street} onChange={e => set('street', e.target.value)} required />
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">City</label>
                <input className="input" placeholder="Mumbai" value={form.city} onChange={e => set('city', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">State</label>
                <input className="input" placeholder="Maharashtra" value={form.state} onChange={e => set('state', e.target.value)} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Postal Code</label>
                <input className="input" placeholder="400001" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Country</label>
                <input className="input" value={form.country} onChange={e => set('country', e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" /> Placing Order...</> : '🍕 Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 84 }}>
          <h3 style={{ marginBottom: 18 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {cart.products.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span style={{ textTransform: 'capitalize' }}>
                  {item.productId?.productName || 'Pizza'} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent)' }}>₹{cart.totalPrice}</span>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.8rem', color: 'var(--success)', textAlign: 'center' }}>
            ✓ Free delivery on all orders
          </div>
        </div>
      </div>
    </div>
  );
};
