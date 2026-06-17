import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Edit3, Check, X, FileText, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { displayDate } from '../utils/helpers';

const Timeline = ({ days, isEditable = false, onDaysUpdate }) => {
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [editingActivity, setEditingActivity] = useState(null); 
  const [editForm, setEditForm] = useState({ time: '', activity: '', location: '', notes: '' });

  const toggleDay = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const startEdit = (dayIdx, actIdx, act) => {
    setEditingActivity({ dayIdx, actIdx });
    setEditForm({
      time: act.time || '',
      activity: act.activity || '',
      location: act.location || '',
      notes: act.notes || '',
    });
  };

  const cancelEdit = () => {
    setEditingActivity(null);
  };

  const saveEdit = (dayIdx, actIdx) => {
    if (!editForm.activity.trim()) return;
    
    const updatedDays = [...days];
    updatedDays[dayIdx].activities[actIdx] = {
      ...updatedDays[dayIdx].activities[actIdx],
      ...editForm
    };
    
    onDaysUpdate(updatedDays);
    setEditingActivity(null);
  };

  const deleteActivity = (dayIdx, actIdx) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const updatedDays = [...days];
      updatedDays[dayIdx].activities.splice(actIdx, 1);
      onDaysUpdate(updatedDays);
    }
  };

  const addActivity = (dayIdx) => {
    const updatedDays = [...days];
    const newAct = {
      time: '12:00 PM',
      activity: 'New Activity',
      location: '',
      notes: ''
    };
    updatedDays[dayIdx].activities.push(newAct);
    onDaysUpdate(updatedDays);
    
    startEdit(dayIdx, updatedDays[dayIdx].activities.length - 1, newAct);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {days.map((day, dayIdx) => {
        const isExpanded = !!expandedDays[day.dayNumber];
        return (
          <div key={day.dayNumber} className="glass-panel" style={{ overflow: 'hidden' }}>
            {}
            <div
              onClick={() => toggleDay(day.dayNumber)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                }}>
                  {day.dayNumber}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                    Day {day.dayNumber}
                  </h3>
                  {day.date && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {displayDate(day.date)}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                </span>
                {isExpanded ? <ChevronUp size={20} className="text-secondary" /> : <ChevronDown size={20} className="text-secondary" />}
              </div>
            </div>

            {}
            {isExpanded && (
              <div style={{ padding: '1.5rem' }}>
                {day.activities.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '1rem 0' }}>
                    No activities planned for this day yet.
                  </p>
                ) : (
                  <div className="timeline-container">
                    {day.activities.map((act, actIdx) => {
                      const isEditing = editingActivity?.dayIdx === dayIdx && editingActivity?.actIdx === actIdx;

                      return (
                        <div key={act._id || actIdx} className="timeline-item">
                          <div className="timeline-badge" />
                          <div className="timeline-content glass-panel" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                            {isEditing ? (
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                                  <div>
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Time</label>
                                    <input
                                      type="text"
                                      className="form-input"
                                      value={editForm.time}
                                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                      placeholder="e.g. 09:00 AM"
                                    />
                                  </div>
                                  <div>
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Activity Name</label>
                                    <input
                                      type="text"
                                      className="form-input"
                                      value={editForm.activity}
                                      onChange={(e) => setEditForm({ ...editForm, activity: e.target.value })}
                                      placeholder="What are you doing?"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Location / Venue</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    placeholder="e.g. Eiffel Tower, Paris"
                                  />
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Description / Notes</label>
                                  <textarea
                                    className="form-input"
                                    rows="2"
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                    placeholder="Add tips, links, or booking references..."
                                    style={{ resize: 'vertical' }}
                                  />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <button onClick={cancelEdit} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                                    <X size={14} /> Cancel
                                  </button>
                                  <button onClick={() => saveEdit(dayIdx, actIdx)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                                    <Check size={14} /> Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Standard View */
                              <div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {act.time && (
                                      <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        color: '#818cf8',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                      }}>
                                        <Clock size={12} />
                                        {act.time}
                                      </span>
                                    )}
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: '600', margin: 0 }}>
                                      {act.activity}
                                    </h4>
                                  </div>

                                  {isEditable && (
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                      <button
                                        onClick={() => startEdit(dayIdx, actIdx, act)}
                                        title="Edit Activity"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
                                      >
                                        <Edit3 size={15} />
                                      </button>
                                      <button
                                        onClick={() => deleteActivity(dayIdx, actIdx)}
                                        title="Delete Activity"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: '0.25rem' }}
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {act.location && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={14} className="text-secondary" />
                                    <span>{act.location}</span>
                                  </div>
                                )}

                                {act.notes && (
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                                    <FileText size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ whiteSpace: 'pre-wrap' }}>{act.notes}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Activity Trigger */}
                {isEditable && (
                  <button
                    onClick={() => addActivity(dayIdx)}
                    className="btn btn-secondary"
                    style={{ width: '100%', borderStyle: 'dashed', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={16} /> Add Activity
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
