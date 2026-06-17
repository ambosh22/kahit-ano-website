import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MapView() {
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const lat = params.get('lat');
  const lng = params.get('lng');
  const name = params.get('name') || 'Location';

  if (!lat || !lng) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h3>Missing location</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Location data not available.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => navigate(-1)}>Go back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=17&output=embed`;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <button className="btn" onClick={() => navigate(-1)}>Back</button>
          </div>
          <h2 style={{ margin: 0 }}>{name}</h2>
          <div style={{ width: 80 }} />
        </div>

        <div className="card" style={{ padding: 0, height: '70vh' }}>
          <iframe
            title="map"
            src={src}
            style={{ width: '100%', height: '100%', border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
