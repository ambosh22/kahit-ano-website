import { useLocation } from 'react-router-dom';
import logo from '../assets/kahitanologo.png';

export default function Footer() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.brand}>
          <img src={logo} alt="Kahit Ano" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={styles.name}>Kahit Ano Food Decision</span>
        </div>
        <p style={styles.tagline}>"Hindi mo alam kakainin mo? Kami bahala."</p>
        <p style={styles.copy}>&copy; 2026 Kahit Ano. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    padding: '32px 0',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    marginTop: 'auto',
    transition: 'background 0.3s',
  },
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  name: { fontWeight: 700, fontSize: '18px', color: 'var(--text)' },
  tagline: { color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' },
  copy: { color: 'var(--text-muted)', fontSize: '12px' },
};
