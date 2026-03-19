import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Package, ArrowLeft } from 'lucide-react';
import { orderAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getOrderById(id).then(r => setOrder(r.data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const r = await orderAPI.cancelOrder(id);
      setOrder(r.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally { setCancelling(false); }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return <div className="page"><p>Order not found</p></div>;

  const stepIdx = STEPS.indexOf(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status) && order.userId === user?.id;

  return (
    <div className="page">
      <button onClick={() => navigate('/orders')} className="btn btn-ghost" style={{ marginBottom: 20 }}>
        <ArrowLeft size={16}/> Back to Orders
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status tracker */}
          {order.status !== 'cancelled' && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 24 }}>Order Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {STEPS.map((step, i) => (
                  <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {i < STEPS.length - 1 && (
                      <div style={{ position: 'absolute', top: 15, left: '50%', right: '-50%', height: 2, background: i < stepIdx ? 'var(--primary)' : 'var(--border)', zIndex: 0 }} />
                    )}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: i <= stepIdx ? 'var(--primary)' : 'var(--bg-input)', border: `2px solid ${i <= stepIdx ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', position: 'relative', zIndex: 1 }}>
                      {i < stepIdx ? '✓' : i + 1}
                    </div>
                    <p style={{ fontSize: '0.65rem', marginTop: 8, color: i <= stepIdx ? 'var(--text)' : 'var(--text-dim)', textAlign: 'center', textTransform: 'capitalize', maxWidth: 60 }}>{step.replace(/-/g, ' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>❌</span>
              <div>
                <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Order Cancelled</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>This order has been cancelled.</p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 18 }}>Order Items</h3>
            {order.products?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>🍕</span>
                  <div>
                    <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{item.productId?.productName || 'Pizza'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 600 }}>₹{item.productId?.price ? item.productId.price * item.quantity : '—'}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <MapPin size={16} color="var(--primary)" />
              <h4>Delivery Address</h4>
            </div>
            {order.deliveryAddress && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 600, color: 'var(--text)' }}>{order.deliveryAddress.fullName}</p>
                <p>{order.deliveryAddress.phone}</p>
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                <p>{order.deliveryAddress.country}</p>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ marginBottom: 12 }}>Order Info</h4>
            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{order._id?.slice(-8)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items</span>
                <span>{order.totalCount}</span>
              </div>
            </div>
          </div>

          {canCancel && (
            <button onClick={handleCancel} className="btn btn-danger btn-block" disabled={cancelling}>
              {cancelling ? <span className="spinner spinner-sm" /> : '❌ Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
