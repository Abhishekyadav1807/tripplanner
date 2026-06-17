import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import Timeline from '../components/Timeline';
import { displayDate } from '../utils/helpers';

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicItinerary = async () => {
      try {
        setLoading(true);
        const res = await api.itinerary.getPublic(shareId);
        setItinerary(res.data);
      } catch (err) {
        setError(err.message || 'This itinerary is private or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicItinerary();
  }, [shareId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <span className="loader loader-lg"></span>
        <p style={{ color: 'var(--text-secondary)' }}>Loading shared itinerary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1.5rem', padding: '2rem', textAlign: 'center', background: 'var(--bg-main)' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.95rem' }}>
            {error}
          </p>
        </div>
        <Link to="/login" className="btn btn-primary">
          Sign In to Trip Itinerary AI
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '2rem 1rem 5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Brand Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <span>Trip Itinerary AI</span>
          </div>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            Create Your Own Trip
          </Link>
        </div>

        {/* Header Display */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <span>{itinerary.destination}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
            {itinerary.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <span>{displayDate(itinerary.startDate)} - {displayDate(itinerary.endDate)}</span>
            <span>({itinerary.days?.length} {itinerary.days?.length === 1 ? 'Day' : 'Days'})</span>
          </div>
        </div>

        {/* Public read-only timeline */}
        <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <Timeline days={itinerary.days || []} isEditable={false} />
        </div>

        {/* Footer Promo CTA */}
        <div className="glass-panel animate-fade-in" style={{ marginTop: '3.5rem', padding: '2.5rem 2rem', textAlign: 'center', background: 'var(--gradient-highlight)', borderColor: 'rgba(99, 102, 241, 0.2)', animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Create Your Own Custom Travel Calendar
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            Upload booking tickets, flights, or hotel reservations. Let Gemini AI parse dates and build your dream itinerary in seconds.
          </p>
          <Link to="/register" className="btn btn-primary">
            Get Started For Free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SharedItinerary;
