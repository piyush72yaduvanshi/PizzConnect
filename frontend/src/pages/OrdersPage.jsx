import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package } from 'lucide-react';
import { orderAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const statusColors = {
  pending: 'pending', confirmed: 'confirmed', preparing: 'preparing',
  'out-for-delivery': 'out-for-delivery', delivered: 'delivered', cancelled: 'cancelled',
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>📦 My Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Track all your pizza orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3>No orders yet</h3>
          <p style={{ marginBottom: 24 }}>Start by browsing our delicious menu!</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Order ID</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 8 }}>{order._id}</p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${statusColors[order.status] || 'pending'}`}>
                      {order.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12}/> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>₹{order.totalPrice}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.totalCount} item{order.totalCount !== 1 ? 's' : ''}</p>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
