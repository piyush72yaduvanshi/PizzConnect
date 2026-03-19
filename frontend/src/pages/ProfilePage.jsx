import { useState } from 'react';
import { User, Lock, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', mobileNumber: user?.mobileNumber || '', profilePicture: user?.profilePicture || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally { setPwLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="page-header">
        <h1 style={{ fontSize: '2rem' }}>👤 My Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your account information</p>
      </div>

      {/* Avatar Banner */}
      <div className="card" style={{ padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', flexShrink: 0 }}>
          {user?.name?.[0]}
        </div>
        <div>
          <h2 style={{ textTransform: 'capitalize', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: 6, fontSize: '0.75rem', background: 'rgba(255,69,0,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 100 }}>{user?.role}</span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <User size={18} color="var(--primary)" />
          <h3>Personal Information</h3>
        </div>
        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input" value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))} placeholder="Your name" />
            </div>
            <div className="input-group">
              <label className="input-label">Mobile Number</label>
              <input className="input" type="tel" value={profileForm.mobileNumber} onChange={e => setProfileForm(f => ({...f, mobileNumber: e.target.value}))} placeholder="+91..." />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Profile Picture URL</label>
            <input className="input" value={profileForm.profilePicture} onChange={e => setProfileForm(f => ({...f, profilePicture: e.target.value}))} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner spinner-sm" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <Lock size={18} color="var(--primary)" />
          <h3>Change Password</h3>
        </div>
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">Current Password</label>
            <input className="input" type="password" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({...f, currentPassword: e.target.value}))} placeholder="Enter current password" required />
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input className="input" type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({...f, newPassword: e.target.value}))} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input className="input" type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({...f, confirmPassword: e.target.value}))} placeholder="Re-enter new password" required />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? <span className="spinner spinner-sm" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
