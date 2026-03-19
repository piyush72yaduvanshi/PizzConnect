import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CartPage = () => {
  const { cart, cartLoading, fetchCart, updateItem, removeItem, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (cartLoading) return <LoadingSpinner fullScreen />;

  const isEmpty = !cart || cart.products?.length === 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>🛒 Your Cart</h1>
        {!isEmpty && <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{cart.totalCount} item{cart.totalCount !== 1 ? 's' : ''}</p>}
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <ShoppingBag size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3>Your cart is empty</h3>
          <p style={{ marginBottom: 24 }}>Add some delicious pizzas to get started!</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cart.products.map(item => (
              <div key={item.productId?._id || item.productId} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 70, height: 70, borderRadius: 12, background: 'linear-gradient(135deg, #1e1e28, #2a1a0e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                  🍕
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: 4 }}>
                    {item.productId?.name || item.productId?.productName || 'Pizza'}
                  </h4>
                  <p style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{item.price} each</p>
                </div>
                {/* Qty control */}
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateItem(item.productId?._id || item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateItem(item.productId?._id || item.productId, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <p style={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>₹{item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.productId?._id || item.productId)} className="btn btn-danger btn-sm" style={{ padding: '8px 10px' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 84 }}>
            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Subtotal ({cart.totalCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Delivery Fee</span>
                <span style={{ color: 'var(--success)' }}>FREE</span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>₹{cartTotal}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/menu" className="btn btn-ghost btn-block" style={{ marginTop: 10, justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
