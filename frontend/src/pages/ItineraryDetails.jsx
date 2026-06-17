import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Share2, Printer, Edit3, Check, X, ArrowLeft, AlertCircle, Eye, Copy, Trash2 } from 'lucide-react';
import api from '../services/api';
import Timeline from '../components/Timeline';
import { displayDate, formatDateString } from '../utils/helpers';

const ItineraryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', destination: '', startDate: '', endDate: '' });

  
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  
  const [showBookings, setShowBookings] = useState(false);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const res = await api.itinerary.getOne(id);
      setItinerary(res.data);
      setEditForm({
        title: res.data.title,
        destination: res.data.destination,
        startDate: formatDateString(res.data.startDate),
        endDate: formatDateString(res.data.endDate),
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch itinerary details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  
  const handleSaveMeta = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.itinerary.update(id, editForm);
      setItinerary(res.data);
      setIsEditingMeta(false);
    } catch (err) {
      setError(err.message || 'Failed to update trip details.');
    }
  };

  
  const handleDaysUpdate = async (updatedDays) => {
    try {
      
      setItinerary(prev => ({ ...prev, days: updatedDays }));
      await api.itinerary.update(id, { days: updatedDays });
    } catch (err) {
      setError('Failed to save activity updates. Reverting changes...');
      fetchItinerary(); 
    }
  };

  
  const handleDeleteTrip = async () => {
    if (window.confirm('Delete this trip permanently?')) {
      try {
        await api.itinerary.delete(id);
        navigate('/history');
      } catch (err) {
        setError(err.message || 'Failed to delete trip');
      }
    }
  };

  
  const handleToggleShare = async () => {
    try {
      const res = await api.itinerary.toggleShare(id);
      setItinerary(prev => ({ ...prev, isPublic: res.data.isPublic }));
    } catch (err) {
      alert(err.message || 'Failed to update sharing setting');
    }
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/shared/${itinerary.shareId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1rem' }}>
        <span className="loader loader-lg"></span>
        <p style={{ color: 'var(--text-secondary)' }}>Loading itinerary details...</p>
      </div>
    );
  }

  if (error && !itinerary) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <Link to="/history" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to History
        </Link>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/shared/${itinerary.shareId}`;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '5rem', position: 'relative' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/history" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} />
          <span>Back to History</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.25fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Header Details & Timeline */}
        <div>
          {/* Header Panel */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            {isEditingMeta ? (
              /* Metadata Edit Form */
              <form onSubmit={handleSaveMeta} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Trip Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.destination}
                    onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsEditingMeta(false)} className="btn btn-secondary">
                    <X size={16} /> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={16} /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* Metadata Display */
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    <span>{itinerary.destination}</span>
                  </div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                    {itinerary.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <span>{displayDate(itinerary.startDate)} - {displayDate(itinerary.endDate)}</span>
                    <span>({itinerary.days?.length} {itinerary.days?.length === 1 ? 'Day' : 'Days'})</span>
                  </div>
                </div>

                <button onClick={() => setIsEditingMeta(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  <span>Edit Details</span>
                </button>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Trip Timeline</h2>
            <Timeline days={itinerary.days || []} isEditable={true} onDaysUpdate={handleDaysUpdate} />
          </div>
        </div>

        {/* Right Side: Quick Booking Docs Panel & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Actions Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Options</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Share Itinerary */}
              <button
                onClick={() => setShowShareModal(true)}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span>Share Itinerary</span>
              </button>

              {/* Print / PDF export */}
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span>Print / Save PDF</span>
              </button>

              {/* Public link eye indicator */}
              {itinerary.isPublic && (
                <Link
                  to={`/shared/${itinerary.shareId}`}
                  target="_blank"
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span>View Shared Page</span>
                </Link>
              )}

              <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--border-color)' }}></div>

              {/* Permanent Deletion */}
              <button
                onClick={handleDeleteTrip}
                className="btn btn-danger"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span>Delete Trip</span>
              </button>

            </div>
          </div>

          {/* Parsed Booking Documents Accordion */}
          {itinerary.bookings && itinerary.bookings.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div
                onClick={() => setShowBookings(!showBookings)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Confirmed Bookings</h3>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  {itinerary.bookings.length}
                </span>
              </div>
              
              {showBookings && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  {itinerary.bookings.map((booking, idx) => (
                    <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      <strong style={{ display: 'block', textTransform: 'capitalize', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        {booking.type}
                      </strong>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {booking.summary}
                      </div>
                      
                      {/* Booking meta fields display */}
                      {booking.details && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {Object.entries(booking.details).map(([key, val]) => {
                            if (typeof val === 'object' || !val) return null;
                            return (
                              <div key={key}>
                                <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                                <span style={{ color: 'var(--text-secondary)' }}>{String(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Share Modal Dialog Overlay */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 7, 12, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <span>Share Trip Itinerary</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Publishing this itinerary generates a secure read-only page. Anyone with the URL can view it.
            </p>

            {/* Share Switch */}
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Link Sharing</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {itinerary.isPublic ? 'Publicly viewable by anyone with link' : 'Private, visible only to you'}
                </span>
              </div>
              <button
                onClick={handleToggleShare}
                className={`btn ${itinerary.isPublic ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {itinerary.isPublic ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Link Copy Input */}
            {itinerary.isPublic && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Shareable URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={publicUrl}
                    readOnly
                    style={{ fontSize: '0.85rem', flex: 1 }}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-secondary"
                    style={{ padding: '0.75rem', minWidth: '90px' }}
                  >
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <button onClick={() => setShowShareModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled class definition for Print media hide overrides */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, button, a, .desktop-menu, .mobile-toggle, .mobile-menu, svg, style, iframe, h3:has(span), div[style*="grid-template-columns"] > div:nth-child(2) {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          div[style*="grid-template-columns"] {
            display: block !important;
          }
          .glass-panel {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin-bottom: 2rem !important;
          }
          .timeline-container::before {
            background: #ccc !important;
          }
          .timeline-badge {
            border-color: #333 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ItineraryDetails;
