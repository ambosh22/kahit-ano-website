import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShuffle, FiDollarSign, FiMapPin, FiCheckSquare, FiMenu, FiX, FiStar } from 'react-icons/fi';
import logo from '../assets/kahitanologo.png';

const navLinks = [
  { path: '/dashboard', label: 'Home', icon: FiHome },
  { path: '/random-picker', label: 'Spin', icon: FiShuffle },
  { path: '/custom-wheel', label: 'Custom', icon: FiStar },
  { path: '/budget-meal', label: 'Budget', icon: FiDollarSign },
  { path: '/restaurants', label: 'Near Me', icon: FiMapPin },
  { path: '/group-voting', label: 'Vote', icon: FiCheckSquare },
];

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLanding) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/dashboard" style={styles.logo} onClick={closeMenu}>
          <img src={logo} alt="Kahit Ano" style={styles.logoImg} />
          <span style={styles.logoText}>Kahit Ano</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                style={{
                  ...styles.link,
                  ...(location.pathname === link.path ? styles.linkActive : {}),
                }}
              >
                <Icon size={16} />
                <span className="nav-label">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.hamburger}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 1000,
    transition: 'background 0.3s',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 800,
    fontSize: '22px',
    color: 'var(--text)',
  },
  logoImg: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  logoText: {
    background: 'var(--gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'all 0.2s',
  },
  linkActive: {
    background: 'var(--gradient)',
    color: 'white',
  },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text)',
    padding: '4px',
  },
};
