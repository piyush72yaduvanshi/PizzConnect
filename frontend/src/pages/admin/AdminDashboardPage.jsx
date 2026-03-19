import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, productAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Package, ShoppingBag, TrendingUp, ListOrdered } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getAllOrders(),
      productAPI.getAll(),
    ]).then(([o, p]) => {
      setOrders(o.data.orders || []);
      setProducts(p.data.products || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const pending = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalPrice, 0);

  const stats = [
    { icon: '📦', label: 'Total Orders', value: orders.length, color: '#3b82f6' },
    { icon: '⏳', label: 'Pending Orders', value: pending, color: '#fbbf24' },
    { icon: '🍕', label: 'Active Products', value: products.length, color: '#22c55e' },
    { icon: '💰', label: 'Revenue', value: `₹${totalRevenue}`, color: '#ff4500' },
  ];

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>🔧 Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your pizza business</p>
      </div>

      {/* Quick nav */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="btn btn-primary"><ShoppingBag size={16}/> Manage Products</Link>
        <Link to="/admin/orders" className="btn btn-secondary"><ListOrdered size={16}/> Manage Orders</Link>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20` }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>View All →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{o._id?.slice(-8)}</span></td>
                  <td style={{ textTransform: 'capitalize' }}>{o.userId?.name || 'User'}</td>
                  <td>{o.totalCount}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{o.totalPrice}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
