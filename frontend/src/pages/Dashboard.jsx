import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Calendar, MapPin, Globe, Award, Sparkles, FolderHeart } from 'lucide-react';
import api from '../services/api';
import { displayDate } from '../utils/helpers';

const Dashboard = ({ user }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await api.itinerary.getAll();
        setItineraries(res.data || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  // Compute metrics
  const totalTrips = itineraries.length;
  const totalBookings = itineraries.reduce((sum, item) => sum + (item.bookings?.length || 0), 0);
  
  // Find next upcoming trip
  const upcomingTrip = itineraries
    .filter(item => new Date(item.startDate) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const recentItineraries = itineraries.slice(0, 3);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            Hey, {user?.username}!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to map out another incredible journey?</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <Plus size={18} />
          <span>New Itinerary</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem' }}>
          <span className="loader loader-lg"></span>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Trips</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalTrips}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Documents Parsed</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalBookings}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Next Adventure</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {upcomingTrip ? `${upcomingTrip.destination}` : 'No upcoming trips'}
                </span>
                {upcomingTrip && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Starts {displayDate(upcomingTrip.startDate)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <Link to="/upload" className="glass-panel glass-panel-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                <Plus size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Create Itinerary
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Upload flights, hotels, or booking receipts. Gemini will extract travel dates and construct a highly tailored schedule.
                </p>
              </div>
            </Link>

            <Link to="/history" className="glass-panel glass-panel-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                <Calendar size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Browse Saved Trips
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  View full interactive timelines, modify schedules, toggle public share settings, or grab shareable links for family and friends.
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Itineraries */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Recent Itineraries</h2>
              {totalTrips > 3 && (
                <Link to="/history" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View All <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {recentItineraries.length === 0 ? (
              <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>No trips planned yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                    Upload your booking tickets and generate an AI-powered day-by-day travel calendar in seconds.
                  </p>
                </div>
                <Link to="/upload" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  <span>Get Started</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {recentItineraries.map((itinerary) => (
                  <Link
                    key={itinerary._id}
                    to={`/itinerary/${itinerary._id}`}
                    className="glass-panel glass-panel-hover"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}
                  >
                    <div>
                      <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        <span>{itinerary.destination}</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {itinerary.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {displayDate(itinerary.startDate)} - {displayDate(itinerary.endDate)}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '600',
                        backgroundColor: itinerary.isPublic ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)',
                        color: itinerary.isPublic ? '#34d399' : 'var(--text-secondary)',
                        border: itinerary.isPublic ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)'
                      }}>
                        {itinerary.isPublic ? 'Shared' : 'Private'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
