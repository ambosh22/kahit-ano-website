import { useState, useEffect } from 'react';
import foods from '../data/foods';
import { getMealType } from '../utils/helpers';
import { FiAward, FiStar, FiCheck, FiRotateCcw, FiFire, FiTarget } from 'react-icons/fi';

const challenges = [
  { text: 'Kumain ka ng gulay ngayon!', type: 'Healthy' },
  { text: 'Try mag-ulam ng something new!', type: 'Ulam' },
  { text: 'Mag-merienda ng matamis ngayon!', type: 'Merienda' },
  { text: 'Kain ng street food ngayon!', type: 'Street' },
  { text: 'Mag-almusal bago mag-12!', type: 'Discipline' },
  { text: 'Iwas softdrinks for today!', type: 'Discipline' },
  { text: 'Try magluto ng sariling pagkain!', type: 'Cook' },
  { text: 'Kumain kasama ang pamilya!', type: 'Family' },
  { text: 'Magbaon ng lunch imbes na bumili!', type: 'Budget' },
  { text: 'Tikim ka ng prutas ngayon!', type: 'Healthy' },
  { text: 'Kain ng isda sa almusal!', type: 'Healthy' },
  { text: 'Mag-water break imbes na milktea!', type: 'Discipline' },
  { text: 'Subukan ang exotic food!', type: 'Adventure' },
  { text: 'Kumain sa karinderya ngayon!', type: 'Budget' },
  { text: 'I-sabaw ang ulam sa kanin!', type: 'Pinoy' },
];

const typeEmojis = {
  Healthy: '🥗', Ulam: '🍖', Merienda: '🍡', Street: '🍢',
  Discipline: '💪', Cook: '👨‍🍳', Family: '👨‍👩‍👧‍👦', Budget: '💰',
  Adventure: '🎢', Pinoy: '🇵🇭',
};

const getTodaySeed = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

export default function FoodChallenge() {
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [completed, setCompleted] = useState({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('fc_completed');
    const savedStreak = localStorage.getItem('fc_streak');
    const savedDate = localStorage.getItem('fc_date');

    if (saved) setCompleted(JSON.parse(saved));
    if (savedStreak) setStreak(Number(savedStreak));

    const seed = getTodaySeed();
    const idx = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % challenges.length;
    setTodayChallenge(challenges[idx]);

    if (savedDate !== seed) {
      setStreak(0);
      localStorage.setItem('fc_streak', '0');
      localStorage.setItem('fc_date', seed);
    }
  }, []);

  const checkIn = () => {
    const newCompleted = { ...completed, [getTodaySeed()]: true };
    const newStreak = streak + 1;
    setCompleted(newCompleted);
    setStreak(newStreak);
    localStorage.setItem('fc_completed', JSON.stringify(newCompleted));
    localStorage.setItem('fc_streak', String(newStreak));
    localStorage.setItem('fc_date', getTodaySeed());
  };

  const isDone = completed[getTodaySeed()];
  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Daily Food Challenge
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Isang challenge kada araw, gawing masaya ang pagkain!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div className="card" style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '20px' }}>
            <FiFire size={28} color="#FF6B35" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '32px', fontWeight: 900, color: 'var(--primary)' }}>{streak}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Day Streak</p>
          </div>
          <div className="card" style={{ flex: 2, minWidth: '300px', textAlign: 'center', padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{today}</p>
            {todayChallenge && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{typeEmojis[todayChallenge.type]}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>{todayChallenge.text}</h3>
                <span className="badge" style={{ background: '#FF9800', fontSize: '11px', marginBottom: '16px', display: 'inline-block' }}>{todayChallenge.type}</span>
                {isDone ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#4CAF50', fontWeight: 700, fontSize: '18px' }}>
                    <FiCheck size={24} /> Done!
                  </div>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={checkIn} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FiCheck size={20} /> Check In
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAward size={20} color="#FFD700" /> Achievement Badges
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: '🌱', label: 'Starter', check: streak >= 1, desc: 'Complete 1 challenge' },
              { icon: '🔥', label: 'On Fire', check: streak >= 3, desc: '3-day streak' },
              { icon: '⭐', label: 'Dedicated', check: streak >= 7, desc: '7-day streak' },
              { icon: '👑', label: 'Champion', check: streak >= 14, desc: '14-day streak' },
              { icon: '🏆', label: 'Legend', check: streak >= 30, desc: '30-day streak' },
            ].map((badge, i) => (
              <div key={i} style={{ textAlign: 'center', opacity: badge.check ? 1 : 0.4, minWidth: '100px' }}>
                <div style={{ fontSize: '36px', marginBottom: '4px', filter: badge.check ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
                <p style={{ fontWeight: 700, fontSize: '12px', color: badge.check ? 'var(--text)' : 'var(--text-muted)' }}>{badge.label}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', background: 'var(--gradient)', color: 'white' }}>
          <FiTarget size={24} style={{ marginBottom: '8px' }} />
          <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>Gawing habit ang masarap na pagkain!</h3>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>Balik ka bukas para sa bagong challenge!</p>
        </div>
      </div>
    </div>
  );
}
