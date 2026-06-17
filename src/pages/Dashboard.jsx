import { Link } from 'react-router-dom';
import { FiPlay, FiDollarSign, FiHome, FiShoppingBag, FiMapPin, FiCheckSquare, FiSmile, FiStar } from 'react-icons/fi';

const cards = [
  { path: '/random-picker', icon: FiPlay, title: 'Random Picker', desc: 'Let the wheel decide your meal!', color: '#FF6B35' },
  { path: '/budget-meal', icon: FiDollarSign, title: 'Budget Meal Finder', desc: 'Find meals within your budget', color: '#4CAF50' },
  { path: '/cook-at-home', icon: FiHome, title: 'Cook at Home', desc: 'Recipes you can make right now', color: '#2196F3' },
  { path: '/buy-outside', icon: FiShoppingBag, title: 'Buy Outside', desc: 'Ready-to-buy foods near you', color: '#9C27B0' },
  { path: '/restaurants', icon: FiMapPin, title: 'Nearby Restaurants', desc: 'Restaurants close to you', color: '#E53935' },
  { path: '/group-voting', icon: FiCheckSquare, title: 'Group Voting', desc: 'Vote with friends!', color: '#FF9800' },
  { path: '/mood', icon: FiSmile, title: 'Mood Picker', desc: 'Food based on how you feel', color: '#00BCD4' },
];

export default function Dashboard() {
  return (
    <div className="page">
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.greeting}>Ano kakainin mo today?</h1>
          <p style={styles.sub}>Pumili ka na ng paraan, tayo na sa gutom!</p>
        </div>

        <div className="dashboard-grid" style={{ marginTop: '32px' }}>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                to={card.path}
                key={card.path}
                className="card"
                style={styles.card}
              >
                <div style={{ ...styles.cardIcon, background: `${card.color}20` }}>
                  <Icon size={32} color={card.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.cardTitle}>{card.title}</h3>
                  <p style={styles.cardDesc}>{card.desc}</p>
                </div>
                <div style={{ ...styles.cardArrow, color: card.color }}>→</div>
              </Link>
            );
          })}
        </div>

        <div className="card" style={{ ...styles.tipCard, marginTop: '32px', background: 'var(--gradient)', color: 'white' }}>
          <div className="tip-content">
            <FiStar size={40} />
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Tip of the Day</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Trying saving ₱50 daily. By the end of the week, you have ₱350 for a nice samgyup!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { textAlign: 'center', padding: '20px 0' },
  greeting: {
    fontSize: '32px', fontWeight: 900,
    background: 'var(--gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: { color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px' },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    padding: '28px 20px', position: 'relative',
    textDecoration: 'none',
    minHeight: '220px',
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: '72px', height: '72px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '12px',
  },
  cardTitle: { fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' },
  cardDesc: { fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 },
  cardArrow: {
    position: 'absolute', bottom: '12px', right: '16px',
    fontSize: '20px', fontWeight: 700,
  },
  tipCard: { padding: '24px 32px', borderRadius: 'var(--radius-lg)' },
};
