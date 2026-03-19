import { Pizza, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer style={{
    background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
    padding: '40px 24px 28px',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.2rem', marginBottom: 12 }}>
            <Pizza size={24} color="var(--primary)" />
            <span className="text-gradient">PizzConnect</span>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Delivering happiness, one slice at a time. Fresh pizzas crafted with love.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Quick Links</h4>
          {[['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'My Orders'], ['/profile', 'Profile']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8, transition: 'var(--transition)' }}
              onMouseEnter={e => e.target.style.color = 'var(--primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Contact</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>📍 123 Pizza Street, Dough City</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>📞 +91 98765 43210</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>✉️ hello@pizzconnect.com</p>
        </div>
      </div>
      <div className="divider" />
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
        © 2025 PizzConnect. All rights reserved. Made with 🍕
      </p>
    </div>
  </footer>
);
