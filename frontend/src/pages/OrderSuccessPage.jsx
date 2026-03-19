import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }} className="animate-fade">
        <div style={{ fontSize: '5rem', marginBottom: 16 }}>🎉</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <CheckCircle size={72} color="var(--success)" />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '1.05rem' }}>
          Your pizza is being prepared with love 🍕. Delivery will arrive soon!
        </p>
        {order && (
          <div className="card" style={{ padding: 20, marginBottom: 28, textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Order ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}>{order._id}</p>
            <div className="divider" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Paid</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>₹{order.totalPrice}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/orders" className="btn btn-primary">Track Order</Link>
          <Link to="/menu" className="btn btn-secondary">Order More</Link>
        </div>
      </div>
    </div>
  );
};
