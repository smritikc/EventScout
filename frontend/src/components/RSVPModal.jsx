import { useState } from 'react';
import { X, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const RSVPModal = ({ event, onClose, onConfirm }) => {
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    
    // Pass data to parent logic
    onConfirm({ guests, status: 'confirmed' });
  };

  if (!event) return null;

  return (
    <div className="rsvp-modal-overlay" onClick={onClose}>
      <div 
        className="rsvp-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rsvp-header">
          <h3>RSVP to {event.title}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="rsvp-body">
          <div className="rsvp-event-summary">
            <div className="summary-item">
              <Calendar size={16} /> 
              <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="summary-item">
              <MapPin size={16} />
              <span>{event.location?.venue || 'TBD'}</span>
            </div>
            <div className="summary-item text-green">
              <Users size={16} />
              <span>{event.capacity - (event.attendees?.length || 0)} seats left</span>
            </div>
          </div>

          <div className="guest-selector">
            <label>Attending +1 guest?</label>
            <p className="helper-text">How many total people including yourself?</p>
            <div className="guest-controls">
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="guest-btn"
                disabled={guests <= 1}
              >
                -
              </button>
              <span className="guest-count">{guests}</span>
              <button 
                onClick={() => setGuests(guests + 1)}
                className="guest-btn"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="rsvp-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="btn-confirm"
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RSVPModal;