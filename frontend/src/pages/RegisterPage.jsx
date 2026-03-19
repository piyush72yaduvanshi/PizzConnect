import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Pizza } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    const result = await register({ name: form.name, email: form.email, mobileNumber: form.mobileNumber, password: form.password });
    if (result.success) navigate('/menu');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 70% 30%, rgba(255,179,71,0.07) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pizza size={30} color="white" />
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Join PizzConnect</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create your account and start ordering</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--danger)', marginBottom: 16, fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input className="input" type="text" placeholder="John Doe" style={{ paddingLeft: 42 }}
                    value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input className="input" type="tel" placeholder="+91 98765..." style={{ paddingLeft: 42 }}
                    value={form.mobileNumber} onChange={e => set('mobileNumber', e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input className="input" type="email" placeholder="you@example.com" style={{ paddingLeft: 42 }}
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="Min 6 chars" style={{ paddingLeft: 42, paddingRight: 42 }}
                    value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input className="input" type="password" placeholder="Re-enter" style={{ paddingLeft: 42 }}
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? <span className="spinner spinner-sm" /> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
