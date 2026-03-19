import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  return (
    <div className="card card-hover animate-fade">
      <div style={{ height: 200, background: 'linear-gradient(135deg, #1e1e28, #2a1a0e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
        {product.category === 'veg' ? '🥦🍕' : '🍖🍕'}
      </div>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize' }}>{product.productName}</h3>
          <span className={`badge badge-${product.category === 'veg' ? 'veg' : 'nonveg'}`} style={{ fontSize: '0.65rem' }}>
            {product.category === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{product.price}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 6 }}>Stock: {product.stock}</span>
          </div>
          {user ? (
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={adding}>
              {adding ? <span className="spinner spinner-sm" /> : '+ Cart'}
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (category === 'all') {
          const r = await productAPI.getAll();
          setProducts(r.data.products || []);
        } else {
          const r = await productAPI.getByCategory(category);
          setProducts(r.data.products || []);
        }
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [category]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) { setSearchResults(null); return; }
    try {
      const r = await productAPI.getByName(val);
      setSearchResults(r.data.products || []);
    } catch { setSearchResults([]); }
  };

  const displayProducts = searchResults ?? products;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1 style={{ fontSize: '2.2rem', marginBottom: 6 }}>🍕 Our Menu</h1>
        <p style={{ color: 'var(--text-muted)' }}>Freshly crafted pizzas for every taste</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-tabs">
          {['all', 'veg', 'non-veg'].map(c => (
            <button key={c} className={`filter-tab ${category === c ? 'active' : ''}`} onClick={() => { setCategory(c); setSearch(''); setSearchResults(null); }}>
              {c === 'all' ? '🍕 All' : c === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 320, position: 'relative', marginLeft: 'auto' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input className="input" style={{ paddingLeft: 40 }} placeholder="Search pizzas..." value={search} onChange={handleSearch} />
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
          {displayProducts.length} {displayProducts.length === 1 ? 'pizza' : 'pizzas'} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : displayProducts.length > 0 ? (
        <div className="grid-auto">{displayProducts.map(p => <ProductCard key={p._id} product={p} />)}</div>
      ) : (
        <div className="empty-state">
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🍕</div>
          <h3>No pizzas found</h3>
          <p>Try a different search or category</p>
        </div>
      )}
    </div>
  );
};
