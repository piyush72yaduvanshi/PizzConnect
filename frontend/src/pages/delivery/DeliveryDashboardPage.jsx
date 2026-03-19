import { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const DeliveryDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deliveryman sees all orders assigned to them (using GET /orders - their orders filtered)
  const load = () => {
    orderAPI.getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); toast.success(`Marked as ${status}`); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const done = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>🛵 Delivery Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{active.length} active deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {[
          ['📦', 'Total Assigned', orders.length, 'var(--info)'],
          ['🚀', 'Active', active.length, 'var(--primary)'],
          ['✅', 'Delivered', done.filter(o => o.status === 'delivered').length, 'var(--success)'],
        ].map(([icon, label, val, color]) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}20`, fontSize: '1.4rem' }}>{icon}</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Orders */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>🟠 Active Orders</h2>
      {active.length === 0 ? (
        <div className="card" style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)', marginBottom: 28 }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>✅</p>
          <p>No active deliveries! You're all caught up.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {active.map(o => (
            <div key={o._id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span className={`badge badge-${o.status}`}>{o.status}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o._id?.slice(-8)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    📍 {o.deliveryAddress?.street}, {o.deliveryAddress?.city}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    📞 {o.deliveryAddress?.phone}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{o.totalPrice}</span>
                  <Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">Details</Link>
                  {o.status === 'confirmed' && (
                    <button className="btn btn-sm" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }} onClick={() => handleStatus(o._id, 'preparing')}>→ Preparing</button>
                  )}
                  {o.status === 'preparing' && (
                    <button className="btn btn-sm" style={{ background: 'rgba(255,69,0,0.15)', color: 'var(--primary)', border: '1px solid rgba(255,69,0,0.3)' }} onClick={() => handleStatus(o._id, 'out-for-delivery')}>→ Pick Up</button>
                  )}
                  {o.status === 'out-for-delivery' && (
                    <button className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }} onClick={() => handleStatus(o._id, 'delivered')}>✅ Delivered</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>✅ Completed Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {done.slice(0, 5).map(o => (
          <div key={o._id} className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className={`badge badge-${o.status}`}>{o.status}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o._id?.slice(-8)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{o.totalPrice}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        ))}
        {done.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No completed deliveries yet</p>}
      </div>
    </div>
  );
};
