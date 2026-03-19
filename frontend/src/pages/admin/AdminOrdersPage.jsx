import { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    orderAPI.getAllOrders().then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleAccept = async (id) => {
    try { await orderAPI.acceptOrder(id); toast.success('Order accepted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleReject = async (id) => {
    try { await orderAPI.rejectOrder(id); toast.success('Order rejected'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); toast.success(`Status updated to ${status}`); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const statuses = ['all', 'pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>📋 Manage Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id}>
                <td>
                  <Link to={`/orders/${o._id}`} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)' }}>{o._id?.slice(-8)}</Link>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{o.userId?.name || 'User'}</td>
                <td>{o.totalCount}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{o.totalPrice}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {o.status === 'pending' && <>
                      <button className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }} onClick={() => handleAccept(o._id)}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(o._id)}>Reject</button>
                    </>}
                    {o.status === 'confirmed' && (
                      <button className="btn btn-sm" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }} onClick={() => handleStatus(o._id, 'preparing')}>→ Preparing</button>
                    )}
                    {o.status === 'preparing' && (
                      <button className="btn btn-sm" style={{ background: 'rgba(255,69,0,0.15)', color: 'var(--primary)', border: '1px solid rgba(255,69,0,0.3)' }} onClick={() => handleStatus(o._id, 'out-for-delivery')}>→ Out for Delivery</button>
                    )}
                    {o.status === 'out-for-delivery' && (
                      <button className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }} onClick={() => handleStatus(o._id, 'delivered')}>→ Delivered</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
