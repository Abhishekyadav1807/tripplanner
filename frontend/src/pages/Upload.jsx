import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, Sparkles, Plane, Hotel, Train, Calendar, MapPin, Edit3, Trash2, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatDateString } from '../utils/helpers';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState('');
  
  
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  
  const [bookings, setBookings] = useState([]);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  
  const loadingSteps = [
    'Reading travel booking details...',
    'Consulting Gemini AI to outline the schedule...',
    'Structuring day-by-day sightseeing activities...',
    'Curating local dining & transport recommendations...',
    'Polishing your finalized travel experience...'
  ];

  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  
  const uploadFile = async (file) => {
    try {
      setError('');
      setUploading(true);
      const res = await api.itinerary.upload(file);
      
      const parsedData = res.data;
      setBookings(prev => [...prev, parsedData]);
      
      
      if (parsedData.details) {
        const details = parsedData.details;
        
        
        if (!destination) {
          if (details.arrivalAirport || details.arrivalStation) {
            setDestination(details.arrivalAirport || details.arrivalStation);
          } else if (details.hotelName && details.address) {
            
            setDestination(details.address);
          }
        }

        
        if (parsedData.type === 'flight' && details.departureTime && !startDate) {
          setStartDate(formatDateString(details.departureTime));
        } else if (parsedData.type === 'hotel' && details.checkInDate && !startDate) {
          setStartDate(formatDateString(details.checkInDate));
          if (details.checkOutDate && !endDate) {
            setEndDate(formatDateString(details.checkOutDate));
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to parse the file. Ensure it is a valid PDF or Image.');
    } finally {
      setUploading(false);
    }
  };

  
  const removeBooking = (idx) => {
    setBookings(prev => prev.filter((_, i) => i !== idx));
  };

  
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDetailsSummary, setEditDetailsSummary] = useState('');

  const startEditBooking = (idx) => {
    setEditingIndex(idx);
    setEditDetailsSummary(bookings[idx].summary);
  };

  const saveBookingEdit = (idx) => {
    const updated = [...bookings];
    updated[idx].summary = editDetailsSummary;
    setBookings(updated);
    setEditingIndex(null);
  };

  
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      return setError('Destination, start date, and end date are required');
    }

    try {
      setError('');
      setGenerating(true);
      
      
      setGenStep(0);
      const interval = setInterval(() => {
        setGenStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3500);

      const response = await api.itinerary.generate(
        title || `${daysDifference(startDate, endDate) + 1} Days in ${destination}`,
        destination,
        startDate,
        endDate,
        bookings
      );

      clearInterval(interval);
      navigate(`/itinerary/${response.data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary. Please try again.');
      setGenerating(false);
    }
  };

  const daysDifference = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  };

  const getBookingIcon = (type) => {
    switch (type) {
      case 'flight': return <Plane size={18} />;
      case 'hotel': return <Hotel size={18} />;
      case 'train': return <Train size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem', position: 'relative' }}>
      
      {}
      {generating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--bg-main)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          {}
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid rgba(99, 102, 241, 0.05)',
            borderTopColor: 'var(--primary)',
            borderBottomColor: 'var(--secondary)',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite',
            marginBottom: '2.5rem'
          }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
            Designing Your Custom Trip
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '480px', transition: 'all 0.3s' }}>
            {loadingSteps[genStep]}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
          Create New Itinerary
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload travel confirmation vouchers or enter details to configure AI-based mapping.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>1. Upload Tickets & Bookings</h2>
          
          {/* Drag & Drop Zone */}
          <div
            className="glass-panel"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              borderStyle: dragActive ? 'solid' : 'dashed',
              borderWidth: '2px',
              borderColor: dragActive ? 'var(--primary)' : 'var(--border-color)',
              cursor: 'pointer',
              background: dragActive ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf, image/*"
              style={{ display: 'none' }}
            />
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              color: 'var(--primary)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UploadCloud size={28} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                {dragActive ? 'Drop your file here' : 'Drag & drop booking document'}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Supports PDF, PNG, JPEG up to 10MB
              </p>
            </div>
            {uploading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className="loader"></span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Extracting booking details...</span>
              </div>
            )}
          </div>

          {/* Parsed bookings list */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Parsed Booking Documents ({bookings.length})
            </h3>
            
            {bookings.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No documents uploaded. The AI will generate suggestions from scratch if you don't provide confirmed bookings.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookings.map((booking, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}>
                        {getBookingIcon(booking.type)}
                      </div>
                      
                      <div style={{ overflow: 'hidden' }}>
                        {editingIndex === idx ? (
                          <input
                            type="text"
                            className="form-input"
                            value={editDetailsSummary}
                            onChange={(e) => setEditDetailsSummary(e.target.value)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
                          />
                        ) : (
                          <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {booking.summary}
                          </p>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {booking.type} • {booking.fileName || 'manual'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      {editingIndex === idx ? (
                        <>
                          <button onClick={() => saveBookingEdit(idx)} className="btn btn-secondary" style={{ padding: '0.25rem', background: 'none', border: 'none' }}>
                            <Check size={16} className="text-success" />
                          </button>
                          <button onClick={() => setEditingIndex(null)} className="btn btn-secondary" style={{ padding: '0.25rem', background: 'none', border: 'none' }}>
                            <X size={16} className="text-error" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditBooking(idx)} title="Edit Summary" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}>
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => removeBooking(idx)} title="Remove Document" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: '0.25rem' }}>
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Setup Itinerary Form */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>2. Specify Trip Information</h2>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <form onSubmit={handleGenerate}>
              
              {/* Trip Title */}
              <div className="form-group">
                <label className="form-label">Trip Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Summer in Tokyo 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Destination */}
              <div className="form-group">
                <label className="form-label">Destination City / Region</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tokyo, Japan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* Dates Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={generating || uploading}
                style={{ width: '100%', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>Generate Itinerary</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Upload;
