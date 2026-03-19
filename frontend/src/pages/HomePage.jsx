import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, ChevronDown } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PIZZA_EMOJIS = ['🍕', '🔥', '✨', '🌶️'];

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  return (
    <div className="card card-hover" style={{ cursor: 'default' }}>
      <div style={{ height: 180, background: 'linear-gradient(135deg, #1e1e28, #2a1a0e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
        {product.category === 'veg' ? '🥦🍕' : '🍖🍕'}
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'capitalize', flex: 1, marginRight: 8 }}>{product.productName}</h3>
          <span className={`badge badge-${product.category === 'veg' ? 'veg' : 'nonveg'}`} style={{ flexShrink: 0, fontSize: '0.65rem' }}>
            {product.category === 'veg' ? '🌿 Veg' : '🍖 Non-veg'}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>₹{product.price}</span>
          {user ? (
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(product._id, 1)}>Add to Cart</button>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    productAPI.getAll().then(r => setFeatured(r.data.products?.slice(0, 8) || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 35% 60%, rgba(255,69,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, rgba(255,179,71,0.08) 0%, transparent 50%)',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="animate-fade">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 24, fontSize: '0.8rem', color: 'var(--primary)' }}>
              🍕 Hot & Fresh Pizzas — Order Now
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
              Pizza That Makes Your{' '}
              <span className="text-gradient">Taste Buds Dance</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              Handcrafted with the finest ingredients, our pizzas are baked to perfection and delivered straight to your door in under 30 minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary btn-lg">
                Order Now <ArrowRight size={18} />
              </Link>
              <a href="#featured" className="btn btn-secondary btn-lg">
                Explore Menu
              </a>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
              {[['⏱', '30 min delivery'], ['⭐', '4.9 rated'], ['🛡️', '100% safe']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animate-float">
            <div style={{
              width: 380, height: 380, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,69,0,0.15) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 200, filter: 'drop-shadow(0 20px 60px rgba(255,69,0,0.3))',
            }}>
              🍕
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[['🍕', '50+', 'Pizza Varieties'], ['⭐', '4.9', 'Average Rating'], ['🚀', '30min', 'Avg Delivery'], ['😊', '10K+', 'Happy Customers']].map(([icon, value, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Pizzas ─────────────────────────────────────────────────────── */}
      <section id="featured" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: 6 }}>🔥 Fan Favorites</h2>
              <p style={{ color: 'var(--text-muted)' }}>Our most-loved pizzas, ordered by thousands</p>
            </div>
            <Link to="/menu" className="btn btn-secondary">View All Menu <ArrowRight size={16}/></Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid-auto">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: 12 }}>🍕</p>
              <p>No pizzas available yet. <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link> and check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, rgba(255,69,0,0.08), rgba(255,179,71,0.04))' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Ready to dig in? 🍕</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '1.05rem' }}>Create your account and get your first order delivered in 30 minutes.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Start Ordering <ArrowRight size={18}/></Link>
        </div>
      </section>
    </div>
  );
};
