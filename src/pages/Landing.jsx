import { Link } from 'react-router-dom';
import { FiPlay, FiDollarSign, FiHome, FiMapPin, FiCheckSquare, FiSmile, FiHeart, FiUsers, FiStar, FiShuffle } from 'react-icons/fi';
import logo from '../assets/kahitanologo.png';
import qr from '../assets/qr.png';

const features = [
  { icon: FiShuffle, title: 'Random Food Picker', desc: 'Spin the wheel and let fate decide your meal!' },
  { icon: FiDollarSign, title: 'Budget Meal Finder', desc: 'Find delicious meals within your budget' },
  { icon: FiHome, title: 'Cook at Home', desc: 'Step-by-step recipes with exact costs' },
  { icon: FiMapPin, title: 'Restaurants Around Me', desc: 'Discover restaurants near your location without GPS fees' },
  { icon: FiCheckSquare, title: 'Group Voting', desc: 'Create rooms and vote with friends!' },
  { icon: FiSmile, title: 'Mood-Based', desc: 'Food suggestions based on how you feel' },
];

const testimonials = [
  { text: '"Hindi na ako nag-aaway ng jowa ko kung ano kakainin!"', user: 'Maria, 23', icon: FiHeart },
  { text: '"Sobrang helpful pag walwalan na kami ng friends."', user: 'Juan, 27', icon: FiUsers },
  { text: '"Yung budget meal finder, lifesaver every payday!"', user: 'Kris, 25', icon: FiStar },
];

const popular = [
  { name: 'Chicken Adobo', price: '₱85', emoji: '🍗' },
  { name: 'Samgyeopsal', price: '₱250', emoji: '🥩' },
  { name: 'Milktea', price: '₱85', emoji: '🧋' },
  { name: 'Siomai Rice', price: '₱50', emoji: '🥟' },
  { name: 'Burger', price: '₱85', emoji: '🍔' },
  { name: 'Halo-Halo', price: '₱70', emoji: '🍨' },
];

export default function Landing() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.heroGlow} />

      <nav style={styles.topNav}>
        <div style={styles.logo}>
          <img src={logo} alt="Kahit Ano" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
          <span style={styles.logoText}>Kahit Ano</span>
        </div>
        <div style={styles.topActions}>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroContent} className="animate-fade">
          <div style={styles.heroEmojis} className="animate-bounce">
            🍔 🍕 🥩 🧋 🍜 🍗
          </div>
          <h1 style={styles.tagline} className="hero-title">
            "Hindi mo alam <span style={styles.highlight}>kakainin mo</span>?"
          </h1>
          <p style={styles.subtitle}>Kami bahala.</p>
          <p style={styles.desc} className="hero-desc">
            The #1 Filipino food decision website. We help you decide what to cook, buy, or eat.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPlay size={20} />
              Start Deciding
            </Link>
            <Link to="/random-picker" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShuffle size={20} />
              Spin Food Wheel
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Features
          </h2>
          <div className="grid grid-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card" style={styles.featureCard}>
                  <div style={styles.featureIconWrap}>
                    <Icon size={32} color="#FF6B35" />
                  </div>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: 'var(--bg-glass)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Testimonials
          </h2>
          <div className="grid grid-3">
            {testimonials.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="card" style={styles.testCard}>
                  <p style={styles.testText}>{t.text}</p>
                  <div style={styles.testUser}>
                    <Icon size={18} color="var(--primary)" />
                    <span style={styles.testName}>{t.user}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Popular Foods
          </h2>
          <div className="grid grid-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {popular.map((p, i) => (
              <div key={i} className="card" style={styles.popCard}>
                <span style={{ fontSize: '40px' }}>{p.emoji}</span>
                <span style={styles.popName}>{p.name}</span>
                <span style={styles.popPrice}>{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ textAlign: 'center', maxWidth: 360 }}>
            <img src={qr} alt="QR code" style={{ width: 180, height: 180, objectFit: 'contain' }} />
            <div style={{ marginTop: 12, fontWeight: 700 }}>Scan na po — Any amount will do 🙏</div>
            <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>Support QR. Hindi live payments—ito ay demo lang.</div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>Kahit Ano Food Decision — "Hindi mo alam kakainin mo? Kami bahala."</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>© 2026 Kahit Ano</p>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s',
  },
  heroGlow: {
    position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
    width: '800px', height: '800px',
    background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  topNav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 32px', maxWidth: '1200px', margin: '0 auto',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: {
    fontSize: '26px', fontWeight: 800,
    background: 'var(--gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  topActions: { display: 'flex', alignItems: 'center' },
  hero: {
    minHeight: '80vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
  },
  heroContent: { maxWidth: '700px' },
  heroEmojis: { fontSize: '48px', marginBottom: '16px' },
  tagline: { fontSize: '48px', fontWeight: 900, lineHeight: 1.2, color: 'var(--text)', marginBottom: '12px' },
  highlight: {
    background: 'var(--gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: { fontSize: '28px', fontWeight: 700, color: 'var(--secondary)', marginBottom: '16px' },
  desc: { fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 },
  heroBtns: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  section: { padding: '80px 0' },
  featureCard: { textAlign: 'center', padding: '32px 20px' },
  featureIconWrap: {
    width: '64px', height: '64px',
    borderRadius: '16px',
    background: 'rgba(255,107,53,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  },
  featureTitle: { fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '12px 0 8px' },
  featureDesc: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 },
  testCard: { textAlign: 'center', padding: '28px 20px' },
  testText: { fontSize: '16px', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.5, marginBottom: '16px' },
  testUser: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  testName: { fontSize: '14px', color: 'var(--text-secondary)' },
  popCard: { textAlign: 'center', padding: '20px' },
  popName: { display: 'block', fontWeight: 600, color: 'var(--text)', margin: '4px 0' },
  popPrice: { color: 'var(--primary)', fontWeight: 700, fontSize: '16px' },
  footer: { textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' },
};
