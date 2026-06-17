import { useState } from 'react';
import { MOOD_ICONS, MOOD_COLORS, MOOD_FOODS } from '../utils/constants';

const moods = ['Happy', 'Sad', 'Stressed', 'Tired', 'Excited', 'Lazy'];

export default function MoodSuggest() {
  const [selectedMood, setSelectedMood] = useState(null);

  const suggestions = selectedMood ? MOOD_FOODS[selectedMood] || [] : [];

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Mood-Based Suggestion
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Ano bang feel mo? Eto ang bagay sa mood mo!
          </p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', textAlign: 'center', color: 'var(--text)', fontSize: '18px' }}>
              Kumusta pakiramdam mo ngayon?
            </h3>
            <div className="mood-grid">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className="card"
                  style={{
                    ...styles.moodBtn,
                    background: selectedMood === mood
                      ? MOOD_COLORS[mood]
                      : 'var(--bg-card)',
                    color: selectedMood === mood ? 'white' : 'var(--text)',
                    border: selectedMood === mood
                      ? `2px solid ${MOOD_COLORS[mood]}`
                      : '2px solid var(--border)',
                    transform: selectedMood === mood ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: '40px' }}>{MOOD_ICONS[mood]}</span>
                  <span style={{ fontWeight: 600, fontSize: '15px', marginTop: '4px' }}>{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="animate-fade">
              <div className="card" style={{
                textAlign: 'center', padding: '32px',
                borderLeft: `4px solid ${MOOD_COLORS[selectedMood]}`,
              }}>
                <span style={{ fontSize: '64px' }}>{MOOD_ICONS[selectedMood]}</span>
                <h2 style={{
                  fontSize: '24px', fontWeight: 800,
                  color: MOOD_COLORS[selectedMood],
                  margin: '12px 0',
                }}>
                  You're feeling {selectedMood}!
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '16px' }}>
                  {selectedMood === 'Happy' && 'Ang saya-saya! Treat yourself!'}
                  {selectedMood === 'Sad' && 'Comfort food para gumaan pakiramdam'}
                  {selectedMood === 'Stressed' && 'Relax lang, kain muna tayo'}
                  {selectedMood === 'Tired' && 'Pahinga at pagkain, yan kelangan mo'}
                  {selectedMood === 'Excited' && 'Celebrate natin! Party food!'}
                  {selectedMood === 'Lazy' && 'Tamad today? Delivery is the key!'}
                </p>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>
                  Suggested Food:
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {suggestions.map((food, i) => (
                    <span
                      key={i}
                      className="badge"
                      style={{
                        background: MOOD_COLORS[selectedMood],
                        padding: '8px 18px',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  moodBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '6px',
    padding: '24px 12px', cursor: 'pointer',
    transition: 'all 0.3s',
    minHeight: '120px',
    borderRadius: 'var(--radius)',
  },
};
