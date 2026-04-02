import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, Heart, Share2, Clock, Calendar, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import '../styles/event-card.css';

const EventCard = ({ event, onRSVP, onSave, className = '' }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(event._id);
  };

  const handleRSVP = (e) => {
    e.stopPropagation();
    if (onRSVP) onRSVP(event);
  };

  const handleClick = () => {
    navigate(`/event/${event._id}`);
  };

  const availableSeats = event.capacity - (event.attendees?.length || 0);
  const isAlmostFull = availableSeats < 10 && availableSeats > 0;
  const isFree = event.price === 0;

  return (
    <div className={`event-card ${className}`} onClick={handleClick}>
      <div className="event-card-image">
        {event.images?.[0] ? (
          <img src={event.images[0]} alt={event.title} />
        ) : (
          <div className="event-image-placeholder">
            <span>{event.category?.charAt(0) || <Calendar size={16} />}</span>
          </div>
        )}
        
        {isFree && (
          <span className="event-badge badge-free">FREE</span>
        )}
        
        {isAlmostFull && (
          <span className="event-badge badge-limited">Only {availableSeats} left!</span>
        )}
      </div>

      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        
        <p className="event-date-venue">
          <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> {format(new Date(event.date), 'EEE, h:a')} • {event.location?.venue || 'TBD'}
        </p>

        <p className="event-stats-line">
          <Ticket size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> {isFree ? 'Free' : `Rs. ${event.price}`} • {availableSeats}/{event.capacity} seats • <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ verticalAlign: 'middle' }} /> {event.rating?.average || '4.8'} ({event.rating?.count || 23})
        </p>

        <div className="event-card-actions">
          <button className="btn-rsvp" onClick={handleRSVP}>
            RSVP
          </button>
          <div className="icon-actions">
            <button 
              className={`btn-icon-action save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
            >
              <Heart size={20} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#6b7280'} />
            </button>
            <button className="btn-icon-action share-btn" onClick={(e) => e.stopPropagation()}>
              <Share2 size={20} color="#6b7280" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;