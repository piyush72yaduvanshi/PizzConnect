import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Pizza, User, LogOut, Settings, ChevronDown, Package, Truck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileMenu(false); }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 900,
      background: 'rgba(14,14,18,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.3rem' }}>
          <Pizza size={28} color="var(--primary)" />
          <span className="text-gradient">PizzConnect</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/menu" className={isActive('/menu')} style={navLinkStyle}>Menu</Link>
          {user && <Link to="/orders" className={isActive('/orders')} style={navLinkStyle}>My Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={isActive('/admin')} style={navLinkStyle}>Admin</Link>}
          {user?.role === 'deliveryman' && <Link to="/delivery" className={isActive('/delivery')} style={navLinkStyle}>Deliveries</Link>}

          {/* Cart */}
          {user && (
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 4, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--primary)', color: 'white',
                  borderRadius: '100%', width: 20, height: 20,
                  fontSize: '0.7rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Dropdown */}
          {user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropdown(!dropdown)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', background: 'var(--bg-card)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                color: 'var(--text)', transition: 'var(--transition)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'white',
                }}>
                  {user.name?.[0]}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <ChevronDown size={14} style={{ transform: dropdown ? 'rotate(180deg)' : '', transition: 'var(--transition)' }} />
              </button>

              {dropdown && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, minWidth: 200,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as</p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.email}</p>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,69,0,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 100 }}>{user.role}</span>
                  </div>
                  <DropItem icon={<User size={15}/>} label="Profile" to="/profile" onClose={() => setDropdown(false)} />
                  <DropItem icon={<Package size={15}/>} label="My Orders" to="/orders" onClose={() => setDropdown(false)} />
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px', color: 'var(--danger)',
                      fontSize: '0.875rem', fontWeight: 500, background: 'transparent',
                      cursor: 'pointer', border: 'none', transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15}/> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .nav-link { padding: 8px 14px; border-radius: var(--radius); font-size:0.9rem; font-weight:500; color:var(--text-muted); transition: var(--transition); }
        .nav-link:hover, .nav-link.active { color: var(--text); background: var(--bg-card); }
        .nav-link.active { color: var(--primary) !important; }
      `}</style>
    </nav>
  );
};

const navLinkStyle = {};

const DropItem = ({ icon, label, to, onClose }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => { navigate(to); onClose(); }} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 16px', color: 'var(--text)',
      fontSize: '0.875rem', fontWeight: 500, background: 'transparent',
      cursor: 'pointer', border: 'none', transition: 'var(--transition)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      {label}
    </button>
  );
};
