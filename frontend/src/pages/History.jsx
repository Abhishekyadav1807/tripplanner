import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Share2, Trash2, Eye, Compass, AlertCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { displayDate } from '../utils/helpers';

const History = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const res = await api.itinerary.getAll();
      setItineraries(res.data || []);
    } catch (err) {
      setError('Failed to fetch travel history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this itinerary permanently?')) {
      try {
        await api.itinerary.delete(id);
        setItineraries(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete itinerary');
      }
    }
  };

  const handleToggleShare = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.itinerary.toggleShare(id);
      setItineraries(prev =>
        prev.map(item =>
          item._id === id ? { ...item, isPublic: res.data.isPublic } : item
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle sharing');
    }
  };

  const filteredItineraries = itineraries.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            Travel History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review, edit, or share all your previously generated travel schedules.</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search destination or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '1rem' }}>
          <span className="loader loader-lg"></span>
          <p style={{ color: 'var(--text-secondary)' }}>Retrieving travel records...</p>
        </div>
      ) : filteredItineraries.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {searchQuery ? 'No matching trips found' : 'No travel history yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
              {searchQuery
                ? 'Try adjusting your search filters to find what you are looking for.'
                : 'Upload travel booking receipts and start planning your travel calendars today.'}
            </p>
          </div>
          {!searchQuery && (
            <Link to="/upload" className="btn btn-primary">
              Create Itinerary
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItineraries.map((itinerary) => {
            const daysCount = itinerary.days?.length || 0;
            const docCount = itinerary.bookings?.length || 0;

            return (
              <div
                key={itinerary._id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}
              >
                {/* Details Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {itinerary.destination}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                    </span>
                    {docCount > 0 && (
                      <>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {docCount} {docCount === 1 ? 'doc' : 'docs'}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <Link to={`/itinerary/${itinerary._id}`} style={{ width: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                      {itinerary.title}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span>{displayDate(itinerary.startDate)} - {displayDate(itinerary.endDate)}</span>
                  </div>
                </div>

                {/* Status and Action Buttons Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  
                  {/* Share Toggle */}
                  <button
                    onClick={(e) => handleToggleShare(itinerary._id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background 0.2s'
                    }}
                    title={itinerary.isPublic ? 'Make Private' : 'Make Public / Shareable'}
                    className="btn-secondary-hover"
                  >
                    {itinerary.isPublic ? (
                      <>
                        <ToggleRight size={28} className="text-success" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>Shared</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={28} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Private</span>
                      </>
                    )}
                  </button>

                  <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }}></div>

                  {/* Actions Grid */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to={`/itinerary/${itinerary._id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      <span>View</span>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(itinerary._id, e)}
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
