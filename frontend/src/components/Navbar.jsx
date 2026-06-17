import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, UploadCloud, History, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null; // Don't show navbar if not logged in

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Upload Booking', path: '/upload' },
    { label: 'Travel History', path: '/history' },
  ];

  return (
    <nav className="glass-panel" style={{ borderRadius: '0 0 var(--radius-md) var(--radius-md)', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100, marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <span>Trip Itinerary AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              style={{ fontSize: '0.95rem' }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Actions (Desktop) */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 500 }}>{user.username}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="mobile-menu" style={{ borderTop: '1px solid var(--border-color)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-card)' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              style={{ padding: '0.75rem 0' }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>
          <div style={{ padding: '0.5rem 0' }}>
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user.username}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', padding: '0.75rem' }}>
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Embedded style for desktop/mobile toggle hide/show */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>

      {/* SVG Gradient definition for logo styling */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="indigo-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </svg>
    </nav>
  );
};

export default Navbar;
