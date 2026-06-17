import { useEffect, useState } from 'react';

function distanceMeters(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.sin(dLon/2)*Math.sin(dLon/2)*Math.cos(lat1)*Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
  return Math.round(R * c);
}

function brandTag(name) {
  if (!name) return null;
  const s = name.toLowerCase();
  if (s.includes('jollibee')) return 'Jollibee';
  if (s.includes('mcdonald') || s.includes('mcd')) return 'McDo/McD';
  if (s.includes('kfc')) return 'KFC';
  if (s.includes('starbuck')) return 'Starbucks';
  if (s.includes('gong cha') || s.includes('coco') || s.includes('milk') || s.includes('tea') || s.includes('boba') || s.includes('gulu')) return 'Milk Tea';
  if (s.includes('cafe') || s.includes('coffee') || s.includes('kopi')) return 'Coffee';
  if (s.includes('carinder') || s.includes('karinderya') || s.includes('turo')) return 'Karinderya';
  if (s.includes('merienda') || s.includes('turon') || s.includes('kakanin') || s.includes('puto') || s.includes('suman')) return 'Merienda';
  if (s.includes('7-eleven') || s.includes('7/11') || s.includes('7 11') || s.includes('7eleven')) return '7-Eleven';
  return null;
}

// Simple opening_hours parser: handles 24/7 or a single HH:MM-HH:MM range (best-effort)
function parseOpeningHours(opening) {
  if (!opening) return { raw: null, openNow: null };
  const s = String(opening).toLowerCase();
  if (s.includes('24/7') || s.includes('24h')) return { raw: opening, openNow: true };

  const m = opening.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!m) return { raw: opening, openNow: null };

  const toMin = (hhmm) => {
    const [hh, mm] = hhmm.split(':').map(Number);
    return hh * 60 + mm;
  };
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = toMin(m[1]);
  const end = toMin(m[2]);
  // handle overnight ranges
  const openNow = start <= end ? (minutes >= start && minutes <= end) : (minutes >= start || minutes <= end);
  return { raw: opening, openNow };
}

function renderStars(rating) {
  if (rating === null || rating === undefined) return null;
  const max = 5;
  const r = Math.round(Number(rating));
  const filled = '★'.repeat(Math.max(0, Math.min(r, max)));
  const empty = '☆'.repeat(Math.max(0, max - Math.max(0, Math.min(r, max))));
  return `${filled}${empty} ${Number(rating).toFixed(1)}`;
}

export default function Restaurants() {
  const [status, setStatus] = useState('idle'); // idle | getting | done | error
  const [error, setError] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setStatus('error');
      return;
    }

    setStatus('getting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatLng({ lat, lng });
        setStatus('done');
      },
      (err) => {
        setError(err.message || 'Permission denied or timeout getting location.');
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    // Try once on mount
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!latLng) return;
    setPlaces([]);
    setPlacesError(null);
    setPlacesLoading(true);

    const qs = `?lat=${encodeURIComponent(latLng.lat)}&lng=${encodeURIComponent(latLng.lng)}&radius=2000`;
    fetch(`/api/nearby-restaurants${qs}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // prioritize known brands and relevant categories
        const enriched = data.map((p) => ({
          ...p,
          distance: distanceMeters(latLng, { lat: p.lat, lng: p.lng }),
          brand: brandTag(p.name),
          // parse opening hours to determine a best-effort open/closed state
          openInfo: parseOpeningHours(p.openingHours || p.opening_hours || null),
        }))
        .filter(p => p.name && (p.brand || /coffee|milk|tea|jollibee|mcdonald|mcd|kfc|burger|fast food|lutong|merienda|snack|carinderia|karinderya|turo|7[-\/\s]?11|7eleven/i.test(p.name) || /Drinks|Fast Food|Snacks|Burger|Filipino Food|Home-cooked|Merienda|Convenience/i.test(p.category)))
        .sort((a,b) => a.distance - b.distance);

        setPlaces(enriched);
      })
      .catch((err) => {
        console.error('Places fetch error', err);
        setPlacesError(err.message || 'Failed to load nearby places');
      })
      .finally(() => setPlacesLoading(false));
  }, [latLng]);

  const mapEmbedSrc = latLng
    ? `https://www.google.com/maps?q=restaurants+near+${encodeURIComponent(latLng.lat)},${encodeURIComponent(latLng.lng)}&z=15&output=embed`
    : null;

  const openExternal = () => {
    if (!latLng) return;
    const url = `https://www.google.com/maps/search/restaurants+near+${encodeURIComponent(latLng.lat)},${encodeURIComponent(latLng.lng)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h1 className="section-title">Nearby Restaurants</h1>
        </div>

        <div style={{ margin: '16px 0 20px', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={getLocation}>
            {status === 'getting' ? 'Detecting location…' : 'Refresh Location'}
          </button>
          <button className="btn btn-secondary" onClick={openExternal} disabled={!latLng}>
            Open in Google Maps
          </button>
        </div>

        {status === 'getting' && <div className="card">Getting location…</div>}
        {status === 'error' && (
          <div className="card" style={{ color: 'var(--danger)' }}>
            <strong>Error</strong>
            <div style={{ marginTop: 8 }}>{error}</div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={getLocation}>Try again</button>
            </div>
          </div>
        )}

        {latLng && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
            <div className="card" style={{ padding: 0, height: '70vh', minHeight: 420 }}>
              <iframe
                title="Nearby restaurants map"
                src={mapEmbedSrc}
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div style={{ height: '70vh', minHeight: 420, overflow: 'auto' }}>
              <div style={{ marginBottom: 8 }}>
                <strong>Nearby results</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Showing up to 50 results from OpenStreetMap (Overpass). Matches brands and common shop types.</div>
              </div>

              {placesLoading && <div className="card">Loading nearby places…</div>}
              {placesError && <div className="card" style={{ color: 'var(--danger)' }}>{placesError}</div>}

              {places.length === 0 && !placesLoading && (
                <div className="card">No nearby fast-food, merienda, home-cooked, milk tea, or coffee shops found within 2km.</div>
              )}

              <div style={{ display: 'grid', gap: 10 }}>
                {places.map(p => (
                  <div key={p.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="restaurant-thumb" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 36 }}>{p.image || '🍽️'}</div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{p.image}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                          </div>

                          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                            {p.rating ? <span style={{ color: '#f5b301' }}>{renderStars(p.rating)}</span> : <span style={{ color: 'var(--text-muted)' }}>No rating</span>}
                            {p.openInfo && p.openInfo.raw && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.openInfo.raw}</span>}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800 }}>{Math.round(p.distance)} m</div>
                          {p.brand && <div style={{ fontSize: 12, color: 'var(--primary)' }}>{p.brand}</div>}
                          <div style={{ marginTop: 6 }}>
                            {p.openInfo && p.openInfo.openNow === true && <span className="badge" style={{ background: '#4CAF50' }}>Open now</span>}
                            {p.openInfo && p.openInfo.openNow === false && <span className="badge" style={{ background: '#EF4444' }}>Closed</span>}
                            {p.openInfo && p.openInfo.openNow === null && <span className="badge" style={{ background: '#9CA3AF' }}>Hours</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
                        <span style={{ marginRight: 8 }}>{p.category}</span>
                        <span>•</span>
                        <span style={{ marginLeft: 8 }}>{p.priceRange}</span>
                      </div>

                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <a className="btn btn-sm btn-primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}&query_place_id=`} target="_blank" rel="noreferrer">Open</a>
                        <a className="btn btn-sm" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.lat)},${encodeURIComponent(p.lng)}`} target="_blank" rel="noreferrer">Directions</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
